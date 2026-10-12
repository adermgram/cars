// Dutch (yellow, blue NL strip) and Nigerian (white, green strip) number-plate price tags.
// The yellow plates are already visible in Abdool's photos, so they double as the brand motif.
export function PlateTag({
  children,
  country = "NL",
  size = "md",
  className = "",
}: {
  children: React.ReactNode;
  country?: "NL" | "NG";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const nl = country === "NL";
  const sizes = {
    sm: "h-6 text-[11px] [--strip:1.1rem] sm:h-8 sm:text-sm sm:[--strip:1.4rem]",
    md: "h-10 text-lg [--strip:1.7rem]",
    lg: "h-14 text-3xl [--strip:2.3rem]",
  }[size];

  return (
    <span
      className={`inline-flex items-stretch overflow-hidden rounded-[0.35em] border-2 border-black/80 font-display font-extrabold leading-none tracking-tight text-black shadow-[0_6px_18px_rgb(0_0_0/0.45)] ${
        nl ? "bg-[#f7c600]" : "bg-[#f4f4ef]"
      } ${sizes} ${className}`}
    >
      <span
        className={`flex w-[var(--strip)] shrink-0 flex-col items-center justify-center gap-[0.15em] text-[0.38em] font-bold text-white ${
          nl ? "bg-[#0a3fa3]" : "bg-[#0a7a3d]"
        }`}
        aria-hidden
      >
        <span className="text-[0.9em] text-[#f7c600]">{nl ? "★" : "✦"}</span>
        {country}
      </span>
      <span className="flex items-center whitespace-nowrap px-[0.55em]">{children}</span>
    </span>
  );
}
