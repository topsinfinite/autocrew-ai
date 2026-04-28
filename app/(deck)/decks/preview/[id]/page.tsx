import { EditorShell } from "@/components/deck/builder/EditorShell";

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditorShell draftId={id} />;
}
