import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary: "rounded-full bg-burgundy text-ivory hover:bg-wine",
  burgundy: "rounded-full bg-burgundy text-ivory hover:bg-wine",
  gold: "rounded-full bg-gold text-ink hover:bg-gold-deep",
  wine: "rounded-full bg-wine text-ivory hover:bg-burgundy",
  outline:
    "rounded-full border border-gold/70 bg-transparent text-burgundy hover:border-gold hover:bg-gold/10",
  ghost:
    "rounded-full border border-burgundy/20 bg-transparent text-burgundy hover:border-burgundy/40 hover:bg-burgundy/5",
  light: "rounded-full bg-ivory text-burgundy hover:bg-cream border border-line",
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
