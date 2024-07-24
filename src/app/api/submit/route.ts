import { ChatsModel } from "@/app/lib/Schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const uploadedLinks: string[] = [];
  console.log("got it");
  try {
    const formData = await req.formData();
    const author = formData.get("author") as string;
    const authorEmail = formData.get("authorEmail") as string;
    const postTitle = formData.get("postTitle") as string;
    const postContent = formData.get("postContent") as string;
    const postAttachments = formData.getAll("attachments[]");

    console.log("Parsed formData:", {
      author,
      authorEmail,
      postTitle,
      postContent,
      postAttachments,
    });

    if (postAttachments.length > 0) {
      await Promise.all(
        postAttachments.map(async (attachment) => {
          if (attachment instanceof File) {
            const link = await uploadFile(attachment);
            if (link) uploadedLinks.push(link);
          }
        })
      );
    }

    const newPost = new ChatsModel({
      author,
      authorEmail,
      postTitle,
      postContent,
      postAttachments: uploadedLinks,
    });
    await newPost.save();

    return new NextResponse(JSON.stringify("success"), { status: 200 });
  } catch (e: any) {
    console.error("Error:", e);
    return new NextResponse(JSON.stringify("failed"), { status: 400 });
  }
}

const myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${process.env.IMGUR_BEARER}`);

async function uploadFile(file: File): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append(file.type.startsWith("image") ? "image" : "video", file);

    console.log("Upload FormData Entries:", Array.from(formData.entries()));

    const responseImgur = await fetch("https://api.imgur.com/3/upload", {
      method: "POST",
      headers: myHeaders,
      body: formData,
    });

    if (responseImgur.ok) {
      const result = await responseImgur.json();
      return result.data.link;
    } else {
      console.error("Upload failed:", responseImgur.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}
