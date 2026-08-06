export function Logo({ size = 36, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/logo.png"
        alt="TurboLoop"
        width={size}
        height={size}
        loading="eager"
        decoding="async"
        className="object-contain"
      />
      {withText && (
        <span className="text-lg font-bold tracking-tight">
          Turbo<span className="text-primary">Loop</span>
        </span>
      )}
    </div>
  );
}

