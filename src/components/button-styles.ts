type Variant = "primary" | "yellow" | "pink" | "mint" | "plain";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-cobalt text-white hover:bg-cobalt-dark",
  yellow: "bg-highlight text-ink",
  pink: "bg-bubblegum text-ink",
  mint: "bg-mint text-ink",
  plain: "bg-white text-ink",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-base",
  lg: "px-6 py-3.5 text-lg",
};

/** Class names for sticker-style buttons and button-looking links. */
export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `sticker inline-flex items-center justify-center gap-2 font-semibold leading-tight ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}
