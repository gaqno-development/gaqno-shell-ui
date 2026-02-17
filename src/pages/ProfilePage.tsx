import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gaqno-development/frontcore/components/ui";
import { Button } from "@gaqno-development/frontcore/components/ui";
import { Input } from "@gaqno-development/frontcore/components/ui";
import { Label } from "@gaqno-development/frontcore/components/ui";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  LoaderPinwheelIcon,
} from "@gaqno-development/frontcore/components/ui";
import { User, Mail, Shield, CreditCard, Camera } from "lucide-react";
import { useProfile } from "../hooks/useProfile";

export default function ProfilePage() {
  const { user, isLoading, error, updateProfile } = useProfile();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  React.useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setPhone(user.phone ?? "");
      setAvatar(user.avatar ?? "");
    }
  }, [user]);

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      await updateProfile({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        avatar: avatar || undefined,
      });
      setMessage({ type: "success", text: "Perfil atualizado." });
    } catch {
      setMessage({
        type: "error",
        text: "Não foi possível atualizar o perfil.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoaderPinwheelIcon size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Não foi possível carregar seu perfil. Verifique se você está
              logado e tente novamente.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais, segurança e preferências
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações pessoais
            </CardTitle>
            <CardDescription>Nome, foto e dados de contato</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitProfile} className="space-y-4">
              {message && (
                <p
                  className={
                    message.type === "success"
                      ? "text-sm text-green-600"
                      : "text-sm text-destructive"
                  }
                >
                  {message.text}
                </p>
              )}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatar || undefined} alt="" />
                  <AvatarFallback>
                    <Camera className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="avatar">URL da foto</Label>
                  <Input
                    id="avatar"
                    type="url"
                    placeholder="https://..."
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Nome"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Sobrenome"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+55 11 99999-9999"
                />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                E-mail
              </CardTitle>
              <CardDescription>
                Seu e-mail de acesso (alteração em breve)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{user?.email ?? "—"}</p>
              <p className="text-sm text-muted-foreground mt-1">
                A alteração de e-mail estará disponível em uma próxima versão.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Autenticação em duas etapas (2FA)
              </CardTitle>
              <CardDescription>
                Aumente a segurança da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                A autenticação em duas etapas estará disponível em breve.
              </p>
              <Button variant="outline" size="sm" disabled>
                Em breve
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Cobrança
              </CardTitle>
              <CardDescription>
                Planos e faturamento do seu tenant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Para ver custos e cobrança do seu tenant, acesse Administração →
                Tenants → Costs.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/admin/costing">Ver custos</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
