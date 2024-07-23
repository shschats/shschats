import { ChatsModel } from "@/app/lib/Schemas";
import NavForwardBtn from "./NavForwardBtn";
import { dbConnect } from "@/app/lib/DBConnect";

interface Props {
  currentPage: number,
  className?: string
}

export default async function NavForward({currentPage, className}: any) {
  await dbConnect();

  const numOfPostsPerPage = 8; //for dev, change later
  const numOfItems = await ChatsModel.countDocuments();
  const numberOfPages = Math.ceil(numOfItems / numOfPostsPerPage);

  return <NavForwardBtn className={className} currentPage={currentPage} numOfPages={numberOfPages} />;
}
