import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/auth/login");
  if (session.user.role !== "admin") redirect("/protected");

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Manage users, books, genres, reviews.</p>
    </div>
  );
}
