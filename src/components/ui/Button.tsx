import Link, { type LinkProps } from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary: "rounded-full bg-burgundy text-white hover:bg-wine",
  burgundy: "rounded-full bg-burgundy text-white hover:bg-wine",
  gold: "rounded-full bg-burgundy text-white hover:bg-wine",
  wine: "rounded-full bg-wine text-white hover:bg-gold-deep",
  outline:
    "rounded-full border border-burgundy bg-transparent text-burgundy hover:border-wine hover:bg-accent/10 hover:text-wine",
  ghost:
    "rounded-full border border-burgundy/30 bg-ivory text-burgundy hover:border-wine hover:bg-accent/10 hover:text-wine",
  light: "rounded-full border border-burgundy/15 bg-white text-burgundy hover:border-wine hover:text-wine",
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
