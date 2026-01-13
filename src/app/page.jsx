import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  if (session.user.role === "admin") {
    redirect("/admin/dashboard");
  }

  redirect("/user/library");
}
