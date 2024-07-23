import CreateSubmitForm from "@/app/components/CreateSubmitForm";
import { isUserBanned } from "@/app/util/sessionUtil";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const isUserBannedVar = await isUserBanned()
  if(isUserBannedVar)
    redirect('/')

  const getSession = await getServerSession();
  
  return (
    <CreateSubmitForm session={getSession} />
  )
}