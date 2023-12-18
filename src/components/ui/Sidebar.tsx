"use client";

import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import HomeIcon from "../icons/home";
import LogIn from "../icons/login";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import MyPostsIcon from "../icons/mine";

export interface SideBarProps {
  username?: string | null;
}

export default function SideBar(props: SideBarProps) {
  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 flex h-[1024px] w-[277px] flex-row items-start gap-5 py-0 pl-4 pr-0">
      <div className="flex h-[124px] w-60 flex-col items-start gap-1 px-0 pb-0 pt-6">
        <div className="flex h-screen flex-col justify-between">
          <div>
            <Link href={"/"}>
              <div className="flex h-12 w-60 flex-row items-center gap-4 rounded-xl bg-gray-50 px-4 py-3">
                <HomeIcon active={pathname === "/"} />
                <p
                  className={`text-base font-medium not-italic leading-6 tracking-[-0.01em] ${
                    pathname === "/" ? "text-indigo-600" : "text-gray-700"
                  }`}
                >
                  Home
                </p>
              </div>
            </Link>
            <div className="cursor-pointer">
              <Link href={props.username ? "/sign-in" : "/me"}>
                <div className="flex h-12 w-60 cursor-pointer flex-row items-center gap-4 rounded-xl bg-gray-50 px-4 py-3">
                  <SignedIn>
                    <MyPostsIcon />
                    <p
                      className={`text-base font-medium not-italic leading-6 tracking-[-0.01em] ${
                        pathname === "/me" ? "text-indigo-600" : "text-gray-700"
                      }`}
                    >
                      My Posts
                    </p>
                  </SignedIn>

                  <SignedOut>
                    <LogIn />
                    <p
                      className={`text-base font-medium not-italic leading-6 tracking-[-0.01em] ${
                        pathname === "/me" ? "text-indigo-600" : "text-gray-700"
                      }`}
                    >
                      Log In
                    </p>
                  </SignedOut>
                </div>
              </Link>
            </div>
          </div>

          <div className="mb-12 flex gap-4 px-4 py-3">
            <div className="h-8 w-8 rounded-[100px]">
              <UserButton />
            </div>
            <div className="flex items-center justify-center">
              <p className="h-6 w-28 text-left text-base font-medium leading-6 tracking-[-0.01em] text-gray-700">
                {props.username}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Separator className="h-screen w-px bg-gray-200" />
      </div>
    </div>
  );
}
