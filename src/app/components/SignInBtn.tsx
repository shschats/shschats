"use client";

import { signIn } from "next-auth/react";
import GoogleButton from "react-google-button";

export default function SignInBtn() {
  return (
    <GoogleButton
      onClick={() => signIn("google", { callbackUrl: "/chats" })}
    ></GoogleButton>
  );
}
