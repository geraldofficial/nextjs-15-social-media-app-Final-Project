import signupImage from "@/assets/signup-image.jpg";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/logo.jpeg"
                alt="Tera"
                width={64}
                height={64}
                className="size-16"
                priority
              />
              <h1 className="text-3xl font-bold">Join Tera</h1>
              <p className="text-center text-muted-foreground">
                Create your account and start connecting with others
              </p>
            </div>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href="/login" className="block text-center hover:underline">
              Already have an account? Log in
            </Link>
          </div>
        </div>
        <Image
          src={signupImage}
          alt=""
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
