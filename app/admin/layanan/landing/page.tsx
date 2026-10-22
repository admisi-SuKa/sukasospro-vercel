import { redirect } from "next/navigation";
import { getOfficePage } from "@/lib/office";
import AdminTop from "@/components/AdminTop";
import LandingManager from "@/components/landing/LandingManager";
export const dynamic = "force-dynamic";
export default async function LandingAdminPage() {
  const user = await getOfficePage();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/admin");
  return <><AdminTop user={user}/><LandingManager user={user}/></>;
}
