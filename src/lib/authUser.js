import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getAuthenticatedUser(request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { get(name) { return cookieStore.get(name)?.value; } } }
  );
  const token = request.headers.get("Authorization")?.split(" ")[1];
  const { data: { user } } = token
    ? await supabase.auth.getUser(token)
    : await supabase.auth.getUser();
  return user || null;
}

export function serializeOrder(order) {
  return JSON.parse(JSON.stringify(order, (key, value) => {
    if (typeof value === "bigint") return value.toString();
    return value;
  }));
}