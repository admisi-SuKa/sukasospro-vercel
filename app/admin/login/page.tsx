import { redirect } from "next/navigation";
// Kompatibilitas tautan lama: hanya ada satu halaman login.
export default function LegacyAdminLogin() { redirect("/login"); }
