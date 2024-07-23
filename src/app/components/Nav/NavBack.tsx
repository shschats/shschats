'use client'

import { useRouter } from "next/navigation";
import Icon from "../Icons";
import { chevronBackOutline } from "ionicons/icons";

interface Props {
  currentPage: number,
  className?: string
}

export default function NavBack({currentPage, className}: Props) {
  const router = useRouter();
  return (
    <button className={className} onClick={handleClick}>
      <Icon icon={chevronBackOutline} />
    </button>
  );

  function handleClick() {
    if (currentPage -1 > 1)
      router.push(`/chats/page-${currentPage-1}`);
    else if (currentPage -1 === 1)
      router.push(`/chats/`);
  }
}
