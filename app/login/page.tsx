import { redirect } from "next/navigation";
import { getOfficePage } from "@/lib/office";
import OfficeLogin from "@/components/office/OfficeLogin";

export const metadata = {
  title: "Login — SosPro",
  description: "Satu login untuk dashboard administrasi, kegiatan dan persetujuan SosPro.",
};

export default async function LoginPage() {
  if (await getOfficePage()) redirect("/admin");
  return <OfficeLogin />;
}
