import React from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "./AdminShell";

export const metadata = {
  title: "Admin Dashboard | Cloth Store",
  description: "E-commerce Management Panel",
};

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin");
  if (user.user_metadata?.role !== "admin") redirect("/");

  return <AdminShell>{children}</AdminShell>;
}
