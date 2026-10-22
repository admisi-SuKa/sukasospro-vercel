import { redirect } from "next/navigation";
import { getOfficePage } from "@/lib/office";
import AdminTop from "@/components/AdminTop";
import AdminEventsManager from "@/components/AdminEventsManager";

export default async function AdminKegiatanPage() {
  const user = await getOfficePage();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/admin");
  return <main className="admin-shell"><AdminTop user={user} /><section className="section"><div className="container"><AdminEventsManager /></div></section></main>;
}
