import { redirect } from "next/navigation";

import { getUserFromCookie } from "@/lib/getUserFromCookie";

export default async function Home() {
  const user = await getUserFromCookie();

  if (!user) {
    redirect("/login");
  }

  const role = user.role?.toLowerCase();

  console.log("role", role);
  if (role === "user" || role === "branch") {
    redirect("/dashboard/penugasan");
  } else {
    redirect("/dashboard");
  }
}
