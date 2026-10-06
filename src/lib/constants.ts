export const APP_NAME = "Mareli Arte";
export const APP_TAGLINE = "Móveis com presença para o espaço que você vive.";

export const NAV_LINKS = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/produtos", label: "Móveis" },
  { href: "/#categorias", label: "Categorias" },
  { href: "/contato", label: "Contato" },
] as const;

export const CONDITION_LABELS = {
  NEW_WITH_TAG: "Novo",
  EXCELLENT: "Excelente",
  VERY_GOOD: "Muito bom",
  GOOD: "Bom",
  VINTAGE: "Retrô",
} as const;

export const PRODUCT_STATUS_LABELS = {
  DRAFT: "Rascunho",
  AVAILABLE: "Disponível",
  RESERVED: "Reservado",
  SOLD: "Vendido",
  ARCHIVED: "Arquivado",
} as const;

export const ORDER_STATUS_LABELS = {
  PENDING: "Pendente",
  PAID: "Pago",
  PROCESSING: "Em preparação",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
} as const;

export const PAYMENT_STATUS_LABELS = {
  PENDING: "Pendente",
  APPROVED: "Aprovado",
  REJECTED: "Recusado",
  REFUNDED: "Reembolsado",
} as const;
