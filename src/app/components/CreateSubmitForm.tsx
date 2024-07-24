"use client";

import {
  arrowBackOutline,
  createOutline,
  documentAttachOutline,
} from "ionicons/icons";
import Icon from "./Icons";
import { FormEvent, useEffect, useState } from "react";
import Notification from "./Notification";
import { useRouter } from "next/navigation";
import RedirectBtn from "./RedirectBtn";

export default function CreateSubmitForm({ session }: any) {
  const [isLoading, setLoading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const [showNotification, sendNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const router = useRouter();

  function handleFileChange(e: React.FormEvent<HTMLInputElement>) {
    const target = e.target as HTMLInputElement & { files: FileList };
    const newFiles = Array.from(target.files);
    const currentPreviewCount = previews.length;
    const maxAttachments = 5;

    if (currentPreviewCount + newFiles.length > maxAttachments) {
      setNotificationMessage("You can only attach up to 5 files.");
      sendNotification(true);
      return;
    }

    newFiles.forEach((file) => {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        const filePreview = fileReader.result as string;

        if (file.type.startsWith("video")) {
          const video = document.createElement("video");
          video.src = filePreview;
          video.onloadedmetadata = () => {
            if (video.duration > 25) {
              setNotificationMessage("Video cannot be longer than 25 seconds.");
              sendNotification(true);
              return;
            }
            setPreviews((prev) => [...prev, filePreview]);
          };
        } else {
          setPreviews((prev) => [...prev, filePreview]);
        }
      };

      fileReader.readAsDataURL(file);
    });
  }

  const handleDeletePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        sendNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("author", session?.user?.name);
    formData.append("authorEmail", session?.user?.email);
    formData.append("postTitle", formData.get("postTitle") as string);
    formData.append("postContent", formData.get("postContent") as string);

    previews.forEach((preview) => {
      const blob = dataURLtoBlob(preview);
      formData.append("attachments[]", blob, "video.mp4");
    });

    const response = await fetch("/api/submit", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setLoading(false);
      router.push("/chats/create/success");
    } else {
      console.error("Error:", response.statusText);
      setLoading(false);
    }
  }

  function dataURLtoBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  return (
    <main className="flex justify-center py-10 px-3 min-h-screen relative">
      <div className="bg-shsgreen border-4 border-solid border-black rounded-md lg:w-3/5 w-full py-6 flex flex-col items-center shadow-black shadow-sm relative">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-10 p-2 lg:w-3/4 w-full h-full"
        >
          <input
            name="postTitle"
            type="text"
            placeholder="Post title"
            className="select-none text-black p-2 text-2xl bg-gray-200 w-full outline-gray-400 outline-2 outline rounded-sm focus:outline-shsyellow focus:bg-gray-100 focus:fade-in-color caret-black"
            required
            maxLength={75}
          />

          <textarea
            name="postContent"
            className="required text-black p-2 resize-none h-96 text-md w-full bg-gray-200 outline-gray-400 outline-2 outline rounded-sm focus:outline-shsyellow focus:bg-gray-100 focus:fade-in-color caret-black"
            required
            maxLength={1000}
          ></textarea>

          <div className="grid grid-cols-2 gap-4 w-full overflow-auto">
            {previews.map((preview, index) => (
              <div key={index} className="w-full flex flex-col items-center">
                <button
                  onClick={() => handleDeletePreview(index)}
                  className="bg-red-600 text-white w-full text-center p-1 rounded-t"
                >
                  Remove
                </button>

                <div className="w-full h-48 bg-gray-100 border border-gray-300 overflow-hidden flex justify-center items-center">
                  {preview.startsWith("data:image") ? (
                    <img
                      src={preview}
                      alt={`preview-${index}`}
                      className="object-cover h-full w-full"
                    />
                  ) : preview.startsWith("data:video") ? (
                    <video controls className="object-cover h-full w-full">
                      <source src={preview} />
                    </video>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <div className="flex-grow" />
          <div className="flex w-full justify-between">
            <RedirectBtn
              className="flex items-center p-3 bg-shsyellow text-black rounded-sm hover:bg-shsdarkyellow transition duration-200 shadow-black shadow-sm"
              url="/chats"
            >
              <Icon icon={arrowBackOutline} />
              Back
            </RedirectBtn>

            <label className="cursor-pointer rounded-sm p-2 bg-gray-200 text-black flex items-center gap-1 shadow-black shadow-sm hover:fade-in-color hover:bg-gray-300">
              <Icon icon={documentAttachOutline} /> Attach files
              <input
                onChange={handleFileChange}
                name="postAttachments"
                type="file"
                multiple
                accept="image/jpeg, image/png, image/gif, video/mp4, video/quicktime"
                hidden
              />
            </label>

            <button
              disabled={isLoading}
              type="submit"
              className="rounded-sm p-2 bg-shsyellow text-black shadow-black shadow-sm flex items-center gap-1 hover:fade-in-color hover:bg-shsdarkyellow"
            >
              <Icon icon={createOutline} />
              {!isLoading ? "Create Post" : "Submitting..."}
            </button>
          </div>
        </form>
      </div>
      {showNotification && <Notification message={notificationMessage} />}
    </main>
  );
}