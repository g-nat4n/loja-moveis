import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { clientIp } from "@/lib/auth/ip";
import { assertLoginAllowed, LoginLockedError, recordLoginAttempt } from "@/lib/auth/lockout";
import { createResetToken } from "@/lib/auth/reset-token";
import { isMailConfigured, sendMail } from "@/lib/mail";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
  }
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const ip = clientIp(request);

  try {
    await assertLoginAllowed(email, ip);
  } catch (error) {
    if (error instanceof LoginLockedError) {
      return NextResponse.json({ message: error.message }, { status: 429 });
    }
    throw error;
  }

  const since = new Date(Date.now() - 60_000);
  const recent = await prisma.loginAttempt.count({
    where: { email, createdAt: { gte: since } },
  });
  if (recent >= 3) {
    return NextResponse.json(
      { message: "Muitas tentativas. Aguarde 1 minuto e tente de novo." },
      { status: 429 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    await recordLoginAttempt(email, ip, false);
    return NextResponse.json({ message: "Este e-mail não possui cadastro." }, { status: 404 });
  }

  const { token, hash } = createResetToken();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetHash: hash,
      passwordResetExpires: new Date(Date.now() + 30 * 60 * 1000),
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.AUTH_URL ?? "http://localhost:3000";
  const resetUrl = `${appUrl}/redefinir-senha?token=${token}`;

  if (!isMailConfigured()) {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetHash: null, passwordResetExpires: null },
    });
    return NextResponse.json(
      {
        message:
          "O envio de e-mail ainda não está configurado. Preencha SMTP_USER e SMTP_PASS no .env (Gmail: senha de app).",
      },
      { status: 503 },
    );
  }

  try {
    await sendMail(
      user.email,
      "Redefinir senha · Morada Móveis",
      `<p>Olá, ${user.name}.</p>
       <p>Recebemos um pedido para redefinir sua senha na Morada Móveis.</p>
       <p><a href="${resetUrl}">Clique aqui para criar uma nova senha</a>. Este link vale por 30 minutos.</p>
       <p>Se você não pediu isso, ignore este e-mail.</p>`,
    );
  } catch (error) {
    console.error("[vesta] falha ao enviar e-mail:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { message: "Não foi possível enviar o e-mail agora. Confira o SMTP no .env e o spam." },
      { status: 500 },
    );
  }

  await prisma.loginAttempt.create({ data: { email, ip, success: true } });
  return NextResponse.json({ ok: true });
}
