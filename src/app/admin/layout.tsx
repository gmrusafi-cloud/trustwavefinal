import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
  title: "Admin | TRUSTWAVE HQ",
  description: "Admin panel for TRUSTWAVE BD",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
