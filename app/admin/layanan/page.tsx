import { redirect } from "next/navigation";
// Modul layanan kini berada pada dashboard terpadu.
export default function LegacyOfficeDashboard() { redirect("/admin#administrasi"); }
