import { Suspense } from "react";
import { AdminClient } from "@/components/AdminClient";
import { isAdmin } from "@/lib/auth";
import { readProducts } from "@/lib/store";

export default async function AdminPage() {
  const [products, admin] = await Promise.all([readProducts(), isAdmin()]);
  return (
    <Suspense>
      <AdminClient initialProducts={products} initiallyAuthed={admin} />
    </Suspense>
  );
}
