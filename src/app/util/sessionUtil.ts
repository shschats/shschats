import { getServerSession } from "next-auth";
import { isUserBannedGET } from "./banApiUtil";

export async function isUserBanned() {
  const session = await getServerSession();
  const sessionEmail =
    session?.user?.email !== null && session?.user?.email !== undefined
      ? session?.user?.email
      : "test";
  return await isUserBannedGET(sessionEmail);
}
