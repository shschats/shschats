"use client";

import { signOut } from "next-auth/react";

interface Props {
  className?: string;
}

export default function SignOutBtn({ className }: Props) {
  return (
    <button className={className} onClick={() => signOut({ callbackUrl: "/" })}>
      signout
    </button>
  );
}
