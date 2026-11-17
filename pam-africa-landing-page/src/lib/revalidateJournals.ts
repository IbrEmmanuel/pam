import { revalidatePath, revalidateTag } from "next/cache";

export function revalidatePublicJournals() {
  revalidateTag("journals");
  revalidatePath("/");
  revalidatePath("/journals");
}
