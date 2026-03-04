import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { APP_CONFIG } from "@/lib/constants";

interface DocsBreadcrumbSchemaProps {
  currentPath: string;
  currentTitle: string;
}

export function DocsBreadcrumbSchema({
  currentPath,
  currentTitle,
}: DocsBreadcrumbSchemaProps) {
  const baseUrl = APP_CONFIG.url;

  const items = [
    { name: "Home", url: baseUrl },
    { name: "Documentation", url: `${baseUrl}/docs` },
  ];

  if (currentPath !== "/docs") {
    items.push({ name: currentTitle, url: `${baseUrl}${currentPath}` });
  }

  return <JsonLd data={breadcrumbSchema(items)} />;
}
