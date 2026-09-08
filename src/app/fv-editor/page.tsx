import { notFound } from "next/navigation";
import { FvEditor } from "@/components/dev/fv-editor";

/**
 * FV の切り抜きを動かすための制作用ページ。公開ビルドでは 404 にする。
 */
export const metadata = {
  title: "FV 切り抜きの位置調整",
  robots: { index: false, follow: false },
};

export default function FvEditorPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return <FvEditor />;
}
