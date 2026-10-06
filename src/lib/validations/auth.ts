import { z } from "zod";
import { isValidCpf, onlyDigits } from "@/lib/utils";

export const PASSWORD_HINT =
  "Mínimo 8 caracteres, 1 letra maiúscula e 1 caractere especial.";

export const passwordSchema = z
  .string()
  .min(8, PASSWORD_HINT)
  .regex(/[A-Z]/, PASSWORD_HINT)
  .regex(/[^A-Za-z0-9]/, PASSWORD_HINT);

export const loginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido"),
  password: z.string().min(1, "Informe a senha"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().trim().email("Informe um e-mail válido"),
  password: passwordSchema,
  phone: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20, "Link inválido ou expirado."),
  password: passwordSchema,
});

export const checkoutSchema = z.object({
  customerName: z.string().min(3, "Informe o nome completo"),
  email: z.string().email("Informe um e-mail válido"),
  cpf: z
    .string()
    .transform(onlyDigits)
    .refine(isValidCpf, "CPF inválido"),
  phone: z
    .string()
    .transform(onlyDigits)
    .refine((value) => value.length >= 10, "Telefone inválido"),
  zip: z
    .string()
    .transform(onlyDigits)
    .refine((value) => value.length === 8, "CEP inválido"),
  street: z.string().min(3, "Informe a rua"),
  numberAddress: z.string().min(1, "Informe o número"),
  complement: z.string().optional(),
  district: z.string().min(2, "Informe o bairro"),
  city: z.string().min(2, "Informe a cidade"),
  state: z.string().length(2, "Informe o UF"),
  shippingMethod: z.string().min(1, "Escolha o envio"),
  couponCode: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().email("Informe um e-mail válido"),
  whatsapp: z.string().optional(),
  message: z.string().min(8, "Escreva uma mensagem"),
});

export const productFilterSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  size: z.string().optional(),
  brand: z.string().optional(),
  condition: z.string().optional(),
  availability: z.enum(["available", "sold", "all"]).optional(),
  min: z.coerce.number().optional(),
  max: z.coerce.number().optional(),
  sort: z.enum(["recent", "price-asc", "price-desc", "name"]).optional(),
  /** Espaço disponível em casa (cm) — retorna móveis que cabem */
  spaceWidth: z.coerce.number().positive().optional(),
  spaceHeight: z.coerce.number().positive().optional(),
  spaceDepth: z.coerce.number().positive().optional(),
  /** single = 1 móvel | combo = soma de 2+ móveis lado a lado */
  fitMode: z.enum(["single", "combo"]).optional(),
});

export const productFormSchema = z.object({
  name: z.string().min(2, "Informe o nome do móvel"),
  description: z.string().min(3, "Escreva uma descrição do móvel"),
  story: z.string().optional(),
  brand: z.string().min(1, "Informe a marca"),
  size: z.string().min(1, "Informe o porte (ex.: Compacto, Médio, Grande)"),
  color: z.string().min(1, "Informe a cor"),
  condition: z.enum(["NEW_WITH_TAG", "EXCELLENT", "VERY_GOOD", "GOOD", "VINTAGE"]),
  widthCm: z.coerce.number({ invalid_type_error: "Informe a largura" }).positive("Largura inválida"),
  heightCm: z.coerce.number({ invalid_type_error: "Informe a altura" }).positive("Altura inválida"),
  depthCm: z.coerce.number({ invalid_type_error: "Informe a profundidade" }).positive("Profundidade inválida"),
  priceCents: z.coerce.number({ invalid_type_error: "Informe o preço" }).int().positive("Informe um preço válido"),
  compareAtCents: z.number().int().positive().nullable().optional(),
  stock: z.coerce.number().int().min(0).default(1),
  status: z.enum(["DRAFT", "AVAILABLE", "RESERVED", "SOLD", "ARCHIVED"]),
  featured: z.boolean().optional(),
  uniquePiece: z.boolean().optional(),
  material: z.string().optional(),
  categoryId: z.string().min(1, "Escolha uma categoria"),
  lookId: z.string().optional().nullable(),
  measurements: z
    .object({
      width: z.string().optional(),
      height: z.string().optional(),
      depth: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
  imageUrl: z.string().optional(),
});

export const categoryFormSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  active: z.boolean().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type ProductFormInput = z.infer<typeof productFormSchema>;
