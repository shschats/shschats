import FailedToLoadData from "@/app/components/FailedToLoadData";
import Icon from "@/app/components/Icons";
import RedirectBtn from "@/app/components/RedirectBtn";
import { dbConnect } from "@/app/lib/DBConnect";
import { ChatsModel } from "@/app/lib/Schemas";
import { arrowBackOutline } from "ionicons/icons";
import Image from "next/image";

interface Post {
  author: string;
  authorEmail: string;
  postTitle: string;
  postContent: string;
  postAttachments: string[];
  _id: string;
}

export default async function Page({ params }: { params: { id: string } }) {
  await dbConnect();
  const id = params.id;

  const data = (await ChatsModel.findById(id)) as Post;
  if (data === null) return <FailedToLoadData />;
  return (
    <div className="text-white flex flex-col justify-center items-center lg:p-20 p-3 text-3xl min-h-screen lg:py-5 py-2 pb-28">
      <div className="bg-shsgreen p-3 lg:w-3/4 w-full h-full flex flex-col gap-6 rounded-2xl flex-grow">
        <div className="flex justify-between text-left">
          <div>{data.postTitle}</div>
          <div>{data.author}</div>
        </div>

        <hr className="my-4 border-t border-white opacity-30" />

        <div className="flex flex-col text-left text-lg">
          <div>{data.postContent}</div>
        </div>

        <div className="flex-grow"></div>

        <div className="flex w-fit gap-4 flex-wrap">
          {data.postAttachments.map((attachment) => {
          const isVideo = attachment.endsWith('.mp4') || attachment.endsWith('.mov');

          return isVideo ? (
            <video key={attachment} src={attachment} controls className="lg:max-h-48 max-h-32 bg-gray-100 border border-gray-300 object-scale-down" />
          ) : (
            <Image key={attachment} src={attachment} alt="Attachment" className="lg:max-h-48 max-h-32 bg-gray-100 border border-gray-300 object-scale-down" />
          );
        })}
        </div>
        
        <hr className="my-4 border-t border-white opacity-30" />

        <div className="sticky bottom-4">
          <RedirectBtn
            className="flex items-center gap-2 p-3 bg-shsyellow text-white rounded-lg hover:bg-shsdarkyellow transition duration-200"
            url="/chats"
          >
            <Icon icon={arrowBackOutline} />
            Back
          </RedirectBtn>
        </div>
      </div>
    </div>
  );
}
