import { redirect } from "next/navigation";
import { getOfficePage } from "@/lib/office";
import AdminTop from "@/components/AdminTop";
import MaterialManager from "@/components/office/MaterialManager";
export default async function Page() {
  const user = await getOfficePage();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/admin");
  return <><AdminTop user={user}/><MaterialManager user={user}/></>;
}
