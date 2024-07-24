import CreatePost from "./CreatePost";
import NavBack from "./Nav/NavBack";
import NavForward from "./Nav/NavForward";
import NavPosition from "./Nav/NavPosition";
import PostPreview from "./PostPreview";
import SignOutBtn from "./SignOutBtn";
import ViewContentBtn from "./ViewContentBtn";
import { isUserBanned } from "../util/sessionUtil";
import FailedToLoadData from "./FailedToLoadData";

export default async function ChatsPanel({ page }: any) {
  const isUserBannedVar = await isUserBanned();
  const numOfPostsPerPage = 8;
  const currentPageNumber = page ? parseInt(page.match(/\d+/)[0]) : 1;
  const getDataFor = currentPageNumber - 1;
  const offset = getDataFor * numOfPostsPerPage;

  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/posts?offset=${offset}&limit=${numOfPostsPerPage}`,
    {
      cache: "no-cache",
      headers: { "Cache-Control": "no-store, must-revalidate" },
    }
  );
  if (!response.ok)
    return <FailedToLoadData/>

  const data = await response.json();

  return (
    <div className="h-screen m-auto flex flex-col items-center lg:py-5 py-2">
      <div className="lg:text-5xl text-3xl lg:p-7 text-shsyellow">shs chats</div>
      <SignOutBtn className="text-shsyellow py-2"/>

      <div className=" lg:w-2/4 md:w-3/4 sm:w-3/4 w-3/4 border-4 border-solid border-black bg-shsgreen flex flex-col outline min-h-0 rounded-md lg:gap-2 relative">

        {data.map(
          (post: { _id: string; author: string; postTitle: string }) => (
            <div key={post._id} className="bg-shsyellow rounded-xl m-2 hover:bg-shsdarkyellow transition duration-200">
              <ViewContentBtn destination={"/chats/view/" + post._id}>
                <PostPreview prop={post}/>
              </ViewContentBtn>
            </div>
          )
        )}
        <div className="text-3xl absolute bottom-0 right-1">
          {!isUserBannedVar && <CreatePost className="hover:text-shsdarkyellow transition duration-200"/>}
        </div>
        {isUserBannedVar && 
          <div className="absolute w-full bottom-14 h-10 bg-yellow-300 flex justify-center lg:text-3xl md:text-xl items-center">
            You have been banned from posting content
          </div>
        }
        <div className="flex text-4xl bg-gray mt-auto w-full items-center justify-center p-2">
          <NavBack className='flex align-middle hover:text-shsdarkyellow transition duration-200' currentPage={currentPageNumber} />
          <NavPosition className='flex align-middle' currentPage={currentPageNumber} />
          <NavForward className='flex align-middle hover:text-shsdarkyellow transition duration-200' currentPage={currentPageNumber} />
        </div>
      </div>
    </div>
  );
}