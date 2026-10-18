import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, isValidAdminSession } from "../../../lib/admin-auth";
import ContentEditor from "./ui";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const cookieStore = await cookies();
  if (!isValidAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    redirect("/admin/analytics/login?next=%2Fadmin%2Fcontent");
  }
  return <ContentEditor />;
}
