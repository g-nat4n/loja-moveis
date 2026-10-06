# Morada Móveis

E-commerce full-stack em Next.js para uma loja de móveis curados. Cada item pode ser exclusivo: ao ser vendido, deixa de ficar disponível.

## Stack

Next.js · TypeScript · Tailwind CSS · PostgreSQL · Prisma · Auth.js · Mercado Pago · Cloudinary

## Desenvolvimento

1. Copie `.env.example` para `.env` e ajuste as chaves.
2. Suba o PostgreSQL: `docker compose up -d` (porta `55433` para não conflitar com um Postgres local)
3. Instale as dependências: `npm install`
4. Aplique o schema: `npx prisma db push`
5. Popule dados de demonstração: `npm run db:seed`
6. Rode o app: `npm run dev`

Conta administrativa do seed:

- e-mail: `admin@morada.com`
- senha: valor de `ADMIN_PASSWORD` no `.env`

Sem credenciais do Mercado Pago o pedido é criado como pendente. Sem token do Melhor Envio, o checkout oferece retirada combinada — cotações de envio não são inventadas.
