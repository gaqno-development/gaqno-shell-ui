import {
  AnimatedSparklesIcon,
  BoxesIcon,
  BookIcon,
  CctvIcon,
  DicesIcon,
  DollarSignIcon,
  DrumIcon,
  FileDescriptionIcon,
  GalleryThumbnailsIcon,
  GearIcon,
  LayoutPanelTopIcon,
  MicIcon,
  PaintIcon,
  PenIcon,
  ShieldCheck,
  ShoppingCartIcon,
  UsersIcon,
  Volume2Icon,
} from "@gaqno-development/frontcore/components/icons";
import type { ShellMenuItem } from "@/components/shell-sidebar";

export const SHELL_MENU_ITEMS: ShellMenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutPanelTopIcon,
  },
  {
    label: "PDV",
    href: "/pdv",
    icon: ShoppingCartIcon,
  },
  {
    label: "CRM",
    href: "/crm/dashboard",
    icon: UsersIcon,
    children: [
      {
        label: "AI Marketing",
        href: "/crm/ai-marketing/video",
        icon: AnimatedSparklesIcon,
      },
    ],
  },
  {
    label: "ERP",
    href: "/erp/catalog",
    icon: BoxesIcon,
    children: [
      {
        label: "Catalog",
        href: "/erp/catalog",
        icon: BoxesIcon,
      },
      {
        label: "AI Content",
        href: "/erp/ai-content",
        icon: AnimatedSparklesIcon,
      },
    ],
  },
  {
    label: "Financeiro",
    href: "/finance/dashboard",
    icon: DollarSignIcon,
  },
  {
    label: "Inteligência Artificial",
    href: "/ai",
    icon: BookIcon,
    children: [
      {
        label: "Áudio",
        href: "/ai/audio",
        icon: Volume2Icon,
        children: [
          {
            label: "Texto para Audio",
            href: "/ai/audio/tts",
            icon: Volume2Icon,
          },
          {
            label: "Audio para Texto",
            href: "/ai/audio/stt",
            icon: MicIcon,
          },
          {
            label: "Música",
            href: "/ai/audio/music",
            icon: DrumIcon,
          },
          {
            label: "Isolar Audio",
            href: "/ai/audio/isolation",
            icon: ShieldCheck,
          },
          {
            label: "Podcast",
            href: "/ai/audio/podcast",
            icon: BookIcon,
          },
        ],
      },
      {
        label: "Imagem",
        href: "/ai/images",
        icon: GalleryThumbnailsIcon,
        children: [
          {
            label: "Texto para Imagem",
            href: "/ai/images/text",
            icon: FileDescriptionIcon,
          },
          {
            label: "Editar Imagem",
            href: "/ai/images/edit",
            icon: PenIcon,
          },
          {
            label: "Inpainting",
            href: "/ai/images/inpainting",
            icon: PaintIcon,
          },
        ],
      },
      {
        label: "Vídeo",
        href: "/ai/video",
        icon: CctvIcon,
        children: [
          {
            label: "Modificar Vídeo",
            href: "/ai/video/modify",
            icon: CctvIcon,
          },
          {
            label: "Usar Referência",
            href: "/ai/video/reference",
            icon: CctvIcon,
          },
          {
            label: "Texto para Vídeo",
            href: "/ai/video/text",
            icon: FileDescriptionIcon,
          },
        ],
      },
      {
        label: "Livros",
        href: "/ai/books",
        icon: BookIcon,
      },
      {
        label: "Retail",
        href: "/ai/retail/dashboard",
        icon: BoxesIcon,
        children: [
          {
            label: "Dashboard",
            href: "/ai/retail/dashboard",
            icon: LayoutPanelTopIcon,
          },
          {
            label: "Content Studio",
            href: "/ai/retail/studio",
            icon: AnimatedSparklesIcon,
          },
          {
            label: "Perfil do Produto",
            href: "/ai/retail/profile",
            icon: BoxesIcon,
          },
          {
            label: "Gerar Conteudo",
            href: "/ai/retail/content",
            icon: FileDescriptionIcon,
          },
          {
            label: "Video de Produto",
            href: "/ai/retail/video",
            icon: CctvIcon,
          },
          {
            label: "Distribuicao",
            href: "/ai/retail/distribution",
            icon: BoxesIcon,
          },
          {
            label: "Atribuicao GMV",
            href: "/ai/retail/attribution",
            icon: DollarSignIcon,
          },
          {
            label: "Faturamento",
            href: "/ai/retail/billing",
            icon: DollarSignIcon,
          },
        ],
      },
    ],
  },
  {
    label: "RPG",
    href: "/rpg",
    icon: DicesIcon,
  },
  {
    label: "Omnichannel",
    href: "/omnichannel",
    icon: BoxesIcon,
  },
  {
    label: "Administração",
    href: "/admin/users",
    icon: UsersIcon,
    children: [
      {
        label: "Domínios",
        href: "/admin/domains",
        icon: GearIcon,
      },
      {
        label: "Tenants",
        href: "/admin/tenants",
        icon: GearIcon,
      },
      {
        label: "Filiais",
        href: "/admin/branches",
        icon: GearIcon,
      },
      {
        label: "Usuários",
        href: "/admin/users",
        icon: UsersIcon,
      },
      {
        label: "Papéis",
        href: "/admin/roles",
        icon: ShieldCheck,
      },
      {
        label: "Menu",
        href: "/admin/menu",
        icon: GearIcon,
      },
      {
        label: "Configurações",
        href: "/admin/settings",
        icon: GearIcon,
      },
      {
        label: "Uso",
        href: "/admin/usage",
        icon: GearIcon,
      },
      {
        label: "Custos",
        href: "/admin/costing",
        icon: GearIcon,
      },
      {
        label: "Modelos IA",
        href: "/admin/ai-models",
        icon: GearIcon,
      },
    ],
  },
];
