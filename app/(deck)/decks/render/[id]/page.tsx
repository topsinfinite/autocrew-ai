import { RenderStack } from "@/components/deck/builder/RenderStack";

export const metadata = { robots: { index: false, follow: false } };

export default async function RenderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RenderStack draftId={id} />;
}
