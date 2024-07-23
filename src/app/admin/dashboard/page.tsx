import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AdminDashboard from "../../components/AdminDashboard";

export default async function page() {
  const session = await getServerSession();
  if (
    session?.user?.email === null ||
    session?.user?.email !== "shschats@gmail.com"
  )
    redirect("/");
    
  return (
    <div>
      <AdminDashboard />
    </div>
  );
}
