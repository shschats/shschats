"use client";

import { chevronForwardOutline } from "ionicons/icons";
import Icon from "../Icons";
import { useRouter } from "next/navigation";

export default function NavForwardBtn({ currentPage, numOfPages, className }: any) {
  const router = useRouter();

  return (
    <button className={className} onClick={handleClick}>
      <Icon icon={chevronForwardOutline} />
    </button>
  );

  function handleClick() {
    if (currentPage + 1 <= numOfPages) {
      router.push(`/chats/page-${currentPage + 1}`);
    }
  }
}
