"use client";

import { useRouter } from "next/navigation";

export default function ViewContentBtn({ destination, children }: any) {
  const router = useRouter();
  return (
    <button
      className="w-full"
      onClick={() => {
        router.push(destination);
      }}
    >
      {children}
    </button>
  );
}
