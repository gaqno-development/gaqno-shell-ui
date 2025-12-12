import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Map of routes to service names for error messages
const SERVICE_NAMES: Record<string, string> = {
  '/dashboard/finance': 'Finance',
  '/dashboard/crm': 'CRM',
  '/dashboard/erp': 'ERP',
  '/dashboard/books': 'AI/Books',
  '/dashboard/admin': 'Admin',
  '/admin': 'Admin',
  '/pdv': 'PDV',
};

function getServiceName(pathname: string): string {
  for (const [route, name] of Object.entries(SERVICE_NAMES)) {
    if (pathname.startsWith(route)) {
      return name;
    }
  }
  return 'serviço';
}

export async function middleware(request: NextRequest) {
  console.log('[AUTH_DEBUG] Middleware iniciado', { 
    pathname: request.nextUrl.pathname,
    method: request.method 
  })

  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  console.log('[AUTH_DEBUG] Verificando usuário autenticado', { pathname: request.nextUrl.pathname })
  
  // Try getUser first (validates JWT with Supabase)
  let user: any = null
  let getUserError: any = null
  
  try {
    const result = await supabase.auth.getUser()
    user = result.data.user
    getUserError = result.error
  } catch (err) {
    getUserError = err
    console.log('[AUTH_DEBUG] Exceção no getUser:', {
      error: String(err),
      pathname: request.nextUrl.pathname
    })
  }

  // If getUser fails (e.g., SSL certificate error), try getSession as fallback
  // getSession reads from cookies without making external requests
  if (getUserError && !user) {
    console.log('[AUTH_DEBUG] getUser falhou, tentando getSession como fallback', {
      error: String(getUserError),
      pathname: request.nextUrl.pathname
    })
    
    try {
      const sessionResult = await supabase.auth.getSession()
      if (sessionResult.data?.session?.user) {
        user = sessionResult.data.session.user
        console.log('[AUTH_DEBUG] getSession bem-sucedido, usuário encontrado', {
          userId: user.id,
          email: user.email,
          pathname: request.nextUrl.pathname
        })
      } else {
        console.log('[AUTH_DEBUG] getSession não retornou sessão válida', {
          hasSession: !!sessionResult.data?.session,
          pathname: request.nextUrl.pathname
        })
      }
    } catch (sessionErr) {
      console.log('[AUTH_DEBUG] getSession também falhou', {
        error: String(sessionErr),
        pathname: request.nextUrl.pathname
      })
    }
  }

  // If still no user after both attempts, allow request through for non-protected routes
  if (!user) {
    console.log('[AUTH_DEBUG] Nenhum método conseguiu obter usuário', {
      pathname: request.nextUrl.pathname,
      isProtected: request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/admin')
    })
    
    // Only redirect to login if it's a protected route
    if (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/admin")) {
      console.log('[AUTH_DEBUG] Rota protegida sem usuário, redirecionando para /login')
      return NextResponse.redirect(new URL("/login", request.url))
    }
    
    return supabaseResponse
  }

  console.log('[AUTH_DEBUG] Resultado getUser', { 
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email,
    hasError: !!getUserError,
    error: getUserError ? String(getUserError) : null,
    pathname: request.nextUrl.pathname
  })

  if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register") {
    if (user) {
      console.log('[AUTH_DEBUG] Usuário já autenticado em página de auth, redirecionando para /dashboard', {
        pathname: request.nextUrl.pathname,
        userId: user.id
      })
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    console.log('[AUTH_DEBUG] Página de auth, usuário não autenticado, permitindo acesso', {
      pathname: request.nextUrl.pathname
    })
    return supabaseResponse;
  }

  if (!user && (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/admin"))) {
    console.log('[AUTH_DEBUG] Rota protegida sem usuário autenticado, redirecionando para /login', {
      pathname: request.nextUrl.pathname
    })
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!user || (!request.nextUrl.pathname.startsWith("/dashboard") && !request.nextUrl.pathname.startsWith("/admin"))) {
    return supabaseResponse
  }

  console.log('[AUTH_DEBUG] Buscando perfil do usuário', {
    pathname: request.nextUrl.pathname,
    userId: user.id
  })

  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("tenant_id, role, is_root_admin, feature_permissions")
      .eq("user_id", user.id)
      .single()

    if (profileError || !profile) {
      console.log('[AUTH_DEBUG] Perfil não encontrado ou erro, permitindo requisição (cliente buscará perfil)', {
        hasError: !!profileError,
        hasProfile: !!profile,
        errorMessage: profileError?.message
      })
      return supabaseResponse
    }

    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!profile.is_root_admin) {
        console.log('[AUTH_DEBUG] Usuário não é root admin, redirecionando para /dashboard', {
          pathname: request.nextUrl.pathname,
          userId: user.id
        })
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
      return supabaseResponse
    }

    if (!request.nextUrl.pathname.startsWith("/dashboard")) {
      return supabaseResponse
    }

    if (!profile.tenant_id && !profile.is_root_admin) {
      console.log('[AUTH_DEBUG] Usuário sem tenant_id e não é root admin, redirecionando para /unauthorized', {
        pathname: request.nextUrl.pathname,
        userId: user.id
      })
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    const featureRoutes: Record<string, string> = {
      "/dashboard/finance": "FINANCE",
      "/dashboard/crm": "CRM",
      "/dashboard/erp": "ERP",
      "/dashboard/pdv": "PDV",
      "/dashboard/books": "BOOK_CREATOR",
    }

    for (const [routePrefix, featureKey] of Object.entries(featureRoutes)) {
      if (!request.nextUrl.pathname.startsWith(routePrefix)) {
        continue
      }

      if (profile.is_root_admin) {
        break
      }

      const featurePerms = profile.feature_permissions as Record<string, any> || {}
      const hasAccess = featurePerms[featureKey]?.roles?.length > 0

      if (!hasAccess) {
        console.log('[AUTH_DEBUG] Usuário sem acesso à feature, redirecionando para /dashboard', {
          pathname: request.nextUrl.pathname,
          featureKey,
          userId: user.id
        })
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      break
    }

    console.log('[AUTH_DEBUG] Todas as validações passaram, permitindo acesso', {
      pathname: request.nextUrl.pathname,
      userId: user.id
    })
  } catch (error) {
    console.error('[AUTH_DEBUG] Erro no middleware', {
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      pathname: request.nextUrl.pathname
    })
    return supabaseResponse
  }

  console.log('[AUTH_DEBUG] Middleware finalizado, permitindo requisição', {
    pathname: request.nextUrl.pathname,
    hasUser: !!user
  })

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
