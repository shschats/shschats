import { ChatsModel } from "@/app/lib/Schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log('got it');
  try {
    const formData = await req.formData();
    const author = formData.get('author') as string;
    const authorEmail = formData.get('authorEmail') as string;
    const postTitle = formData.get('postTitle') as string;
    const postContent = formData.get('postContent') as string;

    const postAttachments = formData.getAll('attachments[]');

    let attachments: any[] = [];
    if (postAttachments.length > 0) {
      // Prepare FormData for Imgur API
      const formDataAttachments = new FormData();
      postAttachments.forEach((value) => {
        if (value instanceof File) {
          formDataAttachments.append('attachments[]', value, value.name); // include filename
        } else {
          console.warn('Expected File object but received:', value);
        }
      });

      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/imgur/post`, {
        method: 'POST',
        body: formDataAttachments,
      });

      if (response.ok) {
        attachments = await response.json();
        console.log('uploaded and link =', attachments);
      } else {
        console.log('failed to upload');
      }
    }

    // Save everything to the database
    const newPost = new ChatsModel({
      author,
      authorEmail,
      postTitle,
      postContent,
      postAttachments: attachments,
    });
    await newPost.save();

    return new NextResponse(JSON.stringify('success'), { status: 200 });
  } catch (e: any) {
    console.error('Error:', e);
    return new NextResponse(JSON.stringify('failed'), { status: 400 });
  }
}