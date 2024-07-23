"use client";

import { addCircleOutline } from "ionicons/icons";
import Icon from "./Icons";
import { useRouter } from "next/navigation";

interface Props {
  className?: string
}

export default function CreatePost({className}: Props) {
  const router = useRouter();
  return (
    <button className={className} onClick={() => router.push("/chats/create")}>
      <Icon className="text-5xl" icon={addCircleOutline}></Icon>
    </button>
  );
}
