import { revalidatePath, revalidateTag } from "next/cache";

export function revalidatePublicProjects() {
  revalidateTag("projects");
  revalidatePath("/");
  revalidatePath("/projects");
}
