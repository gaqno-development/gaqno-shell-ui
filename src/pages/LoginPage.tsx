import { Link } from "react-router-dom";
import { Lock, Mail, AlertCircle } from "lucide-react";
import {
  Input,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@gaqno-dev/frontcore/components/ui";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const { form, onSubmit, isSubmitting, error } = useLogin();

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
      <Card className="relative w-full max-w-md border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 border border-white/20">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-white tracking-tight">
            Bem-vindo de volta
          </CardTitle>
          <CardDescription className="text-white/60 text-base">
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/90 font-medium">
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          disabled={isSubmitting}
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/90 font-medium">
                      Senha
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          disabled={isSubmitting}
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="w-full bg-white text-black hover:bg-white/90 font-semibold h-11 text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center pt-6 border-t border-white/10">
          <p className="text-sm text-white/60">
            Não tem uma conta?{" "}
            <Link
              to="/register"
              className="font-semibold text-white hover:text-white/80 underline-offset-4 hover:underline transition-colors"
            >
              Registre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
