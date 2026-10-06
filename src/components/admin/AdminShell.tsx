import Link from "next/link";
import { signOut } from "@/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-line bg-burgundy py-6 text-ivory md:flex md:flex-col">
        <Link href="/" className="display px-6 text-2xl tracking-[0.16em]">
          MARELI
        </Link>
        <p className="mt-1 px-6 text-[10px] uppercase tracking-[0.24em] text-gold">Atelier</p>
        <AdminNav />
        <div className="mt-auto space-y-3 px-6 pt-8">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center border border-gold bg-transparent px-4 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-gold transition hover:bg-gold hover:text-burgundy"
          >
            Voltar para a loja
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full py-2 text-center text-[11px] uppercase tracking-[0.16em] text-ivory/70 transition hover:text-gold"
            >
              Sair
            </button>
          </form>
        </div>
      </aside>
      <div className="md:pl-60">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4 md:hidden">
          <span className="display text-xl">MARELI</span>
          <Link
            href="/"
            className="border border-gold px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-burgundy transition hover:bg-gold"
          >
            Loja
          </Link>
          <div className="w-full">
            <AdminNav variant="mobile" />
          </div>
        </header>
        <div className="p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
