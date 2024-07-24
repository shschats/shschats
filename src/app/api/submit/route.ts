import { ChatsModel } from "@/app/lib/Schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log('got it')
  try {
    const formData = await req.formData();

    const author = formData.get('author')
    const authorEmail = formData.get('authorEmail')

    const postTitle = formData.get('postTitle')
    const postContent = formData.get('postContent')
    const postAttachments = formData.getAll('attachments[]');
    let attachments;
    console.log('type of att is', typeof postAttachments)
    const keys = Object.keys(postAttachments);
    console.log(keys);

    if (postAttachments.length > 0) {

      // Send only the attachments to the API
      const formDataAttachments = new FormData();
      postAttachments.forEach(value => {
        formDataAttachments.append('attachments[]', value)
      });
      const response = await fetch(`${process.env.NEXTAUTH_URL}/api/imgur/post`, {
        method: 'POST',
        body: formDataAttachments,
      });
      
      attachments = await response.json()
      if(response.ok) {
        console.log('uploaded and link =', attachments)
      } else {
        console.log('failed to upload')
      }
    } //this all works but now finnaly submit and save everything to db

    const newPost = new ChatsModel({
      author: author,
      authorEmail: authorEmail,
      postTitle: postTitle,
      postContent: postContent,
      postAttachments: attachments,
    })
    newPost.save()

    return new NextResponse(JSON.stringify('success'), { status: 200 });
  } catch(e: any) {
    console.error('Error:', e);
    return new NextResponse(JSON.stringify('failed'), { status: 400 });
  }
}