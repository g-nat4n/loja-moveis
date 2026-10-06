import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary: "rounded-full bg-black/70 text-white backdrop-blur-sm hover:bg-black/85",
  burgundy: "rounded-full bg-black/80 text-white hover:bg-black/90",
  gold: "rounded-full bg-black/70 text-white backdrop-blur-sm hover:bg-black/85",
  wine: "rounded-full bg-black/65 text-white hover:bg-black/80",
  outline:
    "rounded-full border border-ink/20 bg-transparent text-ink hover:border-ink/40 hover:bg-black/5",
  ghost:
    "rounded-full border border-ink/15 bg-transparent text-ink hover:bg-black/5",
  light: "rounded-full bg-white/90 text-ink hover:bg-white border border-ink/10",
};

type Props = {
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
} & (
  | ({ href: LinkProps["href"] } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">)
  | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: never })
);

export function Button({ variant = "primary", className, children, ...props }: Props) {
  const classes = cn(
    "inline-flex min-h-12 items-center justify-center gap-2 px-7 text-[11px] font-bold uppercase tracking-[0.18em] transition duration-300 disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...rest } = props;
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
