"use server";

import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

export async function toggleResolved(id: string, resolved: boolean) {
  await requireAdmin();
  await db.errorReport.update({
    where: { id },
    data: { resolved: !resolved },
  });
  revalidatePath("/admin/error-reports");
}
