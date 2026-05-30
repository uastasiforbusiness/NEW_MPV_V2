// Root page — middleware.ts handles locale detection and redirects
// to /{locale}. This file exists to satisfy Next.js route resolution.
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/it");
}
