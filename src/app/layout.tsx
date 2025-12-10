import "@gaqno-dev/ui/styles";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@gaqno-dev/ui/components/providers";
import { QueryProvider } from "@gaqno-dev/ui/components/providers";
import { AuthProvider } from "@gaqno-dev/ui/contexts";
import { MicroFrontendErrorBoundary } from "@/components/microfrontend-error-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "White Label Admin",
  description: "White label admin dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AuthProvider>
              <MicroFrontendErrorBoundary>
                {children}
              </MicroFrontendErrorBoundary>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
