import { NextResponse } from "next/server";

const myHeaders = new Headers();
myHeaders.append("Authorization", `Bearer ${process.env.IMGUR_BEARER}`);

export async function POST(req: Request) {
    const uploadedLinks: string[] = [];
    try {
        console.log('body prelog:', req.body)
        const formData = await req.formData();
        const postAttachments = formData.getAll('attachments[]');
        console.log('FormData rec is:', formData);

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
    try {
        const formData = new FormData();
        formData.append(file.type.startsWith('image') ? 'image' : 'video', file);

        console.log('Upload FormData Entries:', Array.from(formData.entries()));

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
    } catch (error) {
        console.error('Error uploading file:', error);
        return null;
    }
}