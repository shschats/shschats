"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  url: string;
  className?: string;
  children?: ReactNode;
}

export default function BackBtn({ url, children, className }: Props) {
  const router = useRouter();
  return (
    <button className={className} onClick={() => router.push(url)}>
      {children}
    </button>
  );
}
