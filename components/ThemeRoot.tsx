import type { CSSProperties, ReactNode } from "react";
import { themeStyleFromPrimary } from "@/lib/color-themes";

type ThemeRootProps = {
  primary: string;
  children: ReactNode;
};

export function ThemeRoot({ primary, children }: ThemeRootProps) {
  const style = themeStyleFromPrimary(primary) as CSSProperties;

  return (
    <div className="theme-root" data-theme={primary.replace("#", "").toLowerCase()} style={style}>
      {children}
    </div>
  );
}
