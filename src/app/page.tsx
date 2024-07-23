import { getServerSession } from "next-auth";
import SignInBtn from "./components/SignInBtn";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await getServerSession()
    if(session)
      redirect('/chats')

    return (
      <main>
        <div className="bg-mainBg h-screen flex flex-col justify-center text-7xl lg:p-64 text-center gap-y-52">
          <div>shs chats</div>
          <div className="text-3xl flex justify-center">
            <SignInBtn/>
          </div>
        </div>
      </main>
    );
}