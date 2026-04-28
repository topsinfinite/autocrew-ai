import coreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...coreWebVitals,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    files: ["components/deck/**/*.{ts,tsx}", "lib/deck/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/components/landing/**",
                "**/components/layout/**",
                "@/components/landing/*",
                "@/components/layout/*",
              ],
              message:
                "Deck components must not import from marketing site components (components/landing or components/layout). Keep deck isolated.",
            },
          ],
        },
      ],
    },
  },
];

export default config;
