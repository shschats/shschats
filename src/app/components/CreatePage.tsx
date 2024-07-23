"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CreatePage({ session }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const jsonObject: { [key: string]: any } = {};
      formData.forEach((value, key) => {
        jsonObject[key] = value;
      });
      jsonObject.author = session?.user?.name;
      jsonObject.authorEmail = session?.user?.email;

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonObject),
      });

      const data = await response.json();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      router.push("/chats/create/success");
    }
  }

  return (
    <form
      className="flex flex-col gap-5 justify-center items-center"
      onSubmit={onSubmit}
    >
      <textarea
        className="text-red-800"
        name="postTitle"
        placeholder="Post Title"
        maxLength={100}
        required
      />
      <textarea
        className="text-red-800"
        name="postContent"
        placeholder="Post Content"
        maxLength={400}
        required
      ></textarea>
      <input
          placeholder="fileInput"
          type="file"
          multiple={true}
          accept=".jpg, .pdf, .png"
        />
      <button className="outline p-1" type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}
