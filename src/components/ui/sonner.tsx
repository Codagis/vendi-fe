"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
      visibleToasts={5}
      toastOptions={{
        classNames: {
          error: "bg-red-50 border-red-200 text-red-700",
          success: "bg-green-50 border-green-200 text-green-700",
          warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
          info: "bg-blue-50 border-blue-200 text-blue-700",
        },
        style: {
          marginBottom: '8px',
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--error-bg": "hsl(0 84% 97%)",
          "--error-text": "hsl(0 84% 45%)",
          "--error-border": "hsl(0 84% 85%)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
