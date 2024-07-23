import { NextResponse } from "next/server";

const myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${process.env.IMGUR_BEARER}`);

export async function POST(req: Request) {
    const uploadedLinks: string[] = [];

    try {
        const formData = await req.formData();
        const postAttachments = formData.getAll('attachments[]');

        await Promise.all(postAttachments.map(async (attachment) => {
            if (attachment instanceof File) {
                const link = await uploadFile(attachment);
                if (link) uploadedLinks.push(link);
            }
        }));

        return NextResponse.json(uploadedLinks, { status: 200 });
    } catch (e: any) {
        console.error('Error:', e);
        return new NextResponse(JSON.stringify('failed'), { status: 400 });
    }
}

async function uploadFile(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append(file.type.startsWith('image') ? 'image' : 'video', file);

    // Convert FormData.entries() to an array and log entries
    const entries = Array.from(formData.entries());
    entries.forEach(([key, value]) => {
        console.log(`FormData entry: ${key} = ${value}`);
    });

    const responseImgur = await fetch("https://api.imgur.com/3/upload", {
        method: "POST",
        headers: myHeaders,
        body: formData,
    });

    if (responseImgur.ok) {
        const result = await responseImgur.json();
        return result.data.link;
    } else {
        console.error('Upload failed:', responseImgur.statusText);
        return null;
    }
}