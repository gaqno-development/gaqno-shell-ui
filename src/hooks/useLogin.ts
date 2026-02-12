import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useSignIn } from "@gaqno-development/frontcore/hooks/auth/useSsoAuth";
import { authStorage } from "@/utils/auth-storage";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const queryClient = useQueryClient();
  const signIn = useSignIn();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(
    (values) => {
      signIn.mutate(
        {
          email: values.email,
          password: values.password,
        },
        {
          onSuccess: (data) => {
            try {
              if (data?.user && data?.tokens) {
                const accessToken =
                  data.tokens.accessToken ??
                  (data.tokens as { access_token?: string }).access_token;
                const expiresAt =
                  data.tokens.expiresAt ??
                  (data.tokens as { expires_at?: number }).expires_at;
                if (accessToken != null) {
                  authStorage.set(data.user, {
                    access_token: accessToken,
                    expires_at: expiresAt,
                  });
                  queryClient.setQueryData(["auth", "me"], data);
                }
              }
            } finally {
              window.location.href = "/dashboard";
            }
          },
          onError: (error: Error) => {
            const errorMessage = error.message || "Erro ao fazer login";
            form.setError("root", {
              message: errorMessage,
            });
          },
        }
      );
    },
    (errors) => {
      console.log("[LOGIN] Validation errors:", errors);
    }
  );

  return {
    form,
    onSubmit,
    isSubmitting: signIn.isPending,
    error: form.formState.errors.root?.message,
  };
};
