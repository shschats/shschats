"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { banUser, isUserBannedGET, unbanUser } from "../util/banApiUtil";

interface DataType {
  _id: string;
  author: string;
  authorEmail: string;
  postTitle: string;
  postContent: string;
  postAttachments: Array<string>;
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DataType[] | null>(null);
  const [isUserBanned, setBanned] = useState(false);
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");

    try {
      const response = await fetch(`/api/search?user=${username}`, {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
        cache: "no-cache",
      });

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteSingle(_id: string) {
    const response = await fetch("/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: _id }),
    });

    if (response.ok) {
      setData((prevData) => 
        prevData?.filter((item) => item._id !== _id) || null
      );
    }
  }

  async function deleteAll(authorEmail: string) {
    const response = await fetch("/api/deleteall", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deleteAll: authorEmail }),
    });

    if (response.ok) {
      setData(null);
    }
  }

  async function handleBan(authorEmail: string) {
    if (isUserBanned) await unbanUser(authorEmail);
    else await banUser(authorEmail);

    await isUserBannedGET(authorEmail)
      .then((state) => setBanned(state))
      .catch((error) => console.error("Error fetching ban status:", error));
  }

  const userArray = data as DataType[];

  useEffect(() => {
    async function updateBanState() {
      if (userArray?.length > 0) {
        const status = await isUserBannedGET(userArray[0].authorEmail);
        setBanned(status);
      }
    }
    updateBanState();
  }, [userArray]);

  return (
    <div className="bg-black h-screen">
      <form
        className="flex flex-col gap-5 justify-center items-center"
        onSubmit={onSubmit}
      >
        <input
          className="text-red-800"
          type="text"
          name="username"
          placeholder="Search posts by name"
        />
        <button className="outline p-1" type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>

      {data && (
        <div className="mt-5 p-5 bg-white rounded shadow-md text-red-700">
          <h2 className="text-lg font-bold">
            Fetched Data ({userArray.length}):
          </h2>
          {userArray.length > 0 && (
            <>
              <div className="flex gap-5 mb-4">
                <button onClick={() => deleteAll(userArray[0].authorEmail)}>
                  Delete all
                </button>
                <button onClick={() => handleBan(userArray[0].authorEmail)}>
                  {isUserBanned ? "Unban User" : "Ban User"}
                </button>
              </div>

              <div className="text-sm">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-2 text-left">Post Title</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {userArray.map((e) => (
                      <tr key={e._id} className="border-b">
                        <td className="p-2">{e.postTitle}</td>
                        <td className="p-2 flex gap-2">
                          <button
                            onClick={() => router.push(`/chats/view/${e._id}`)}
                            className="text-blue-500 hover:underline"
                          >
                            Visit
                          </button>
                          <button
                            onClick={() => deleteSingle(e._id)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}