import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "autocrew-search": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          placeholder?: string;
          "button-label"?: string;
          "primary-color"?: string;
          mode?: "chat" | "voice";
          "auto-send"?: "true" | "false";
        },
        HTMLElement
      >;
    }
  }
}

export {};
