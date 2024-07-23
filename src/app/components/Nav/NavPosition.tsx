import { dbConnect } from "@/app/lib/DBConnect";
import { ChatsModel } from "@/app/lib/Schemas";

export default async function NavPosition({currentPage}: any) {
  await dbConnect();

  const numOfPostsPerPage = 8; //for dev env change to higher later
  const databaseCount = await ChatsModel.countDocuments();
  const numOfPages = Math.ceil(databaseCount / numOfPostsPerPage);

  return <div>({currentPage}/{numOfPages})</div>
}
