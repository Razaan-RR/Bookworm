import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/login");
  if (session.user.role === "admin") redirect("/admin/dashboard");

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">My Library</h1>
      <p>Normal User Dashboard</p>
    </div>
  );
}
