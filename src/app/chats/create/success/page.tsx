"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [redirectTimer, setRedirectTimer] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setRedirectTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (redirectTimer === 1) {
      router.replace("/chats");
      router.refresh();
    }
  }, [redirectTimer]);

  return (
    <div className="text-shsyellow flex h-screen justify-center text-center lg:p-20 p-3 text-3xl lg:py-5 py-2 pb-28">
      <div className="bg-shsgreen p-10 lg:px-52 flex flex-col lg:gap-40 gap-24 rounded-2xl">
        <p>Posted Successfully!</p>
        <p>Returning to the main page in... {redirectTimer}</p>
        <button
          className="mt-auto bg-shsyellow text-white p-3 outline outline-1 outline-shsyellow rounded-lg hover:shadow-xl hover:bg-shsdarkyellow"
          onClick={() => {
            router.replace("/chats");
            router.refresh();
          }}
        >
          Return now
        </button>
      </div>
    </div>
  );
}