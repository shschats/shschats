import ChatsPanel from "@/app/components/ChatsPanel";

export default async function Chats({ params }: { params: { pageNumber: string } }) {
  const pageNum = params.pageNumber;
  return <ChatsPanel page={pageNum}/>;
}