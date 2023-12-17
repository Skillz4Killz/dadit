"use client";

import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import HomeIcon from "../icons/home";
import LogIn from "../icons/login";
import { usePathname } from "next/navigation";

export interface SideBarProps {
  isLoggedIn?: boolean;
}

export default function SideBar(props: SideBarProps) {
  const pathname = usePathname();

  return (
    <div className="absolute left-0 top-0 flex h-[1024px] w-[277px] flex-row items-start gap-5 py-0 pl-4 pr-0">
      <div className="flex h-[124px] w-60 flex-col items-start gap-1 px-0 pb-0 pt-6">
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
          <Link href={"/sign-in"}>
            <div className="flex h-12 w-60 cursor-pointer flex-row items-center gap-4 rounded-xl bg-gray-50 px-4 py-3">
              <LogIn />
              <p
                className={`text-base font-medium not-italic leading-6 tracking-[-0.01em] ${
                  props.isLoggedIn ? "text-indigo-600" : "text-gray-700"
                }`}
              >
                {props.isLoggedIn ? "My Posts" : "Log In"}
              </p>
            </div>
          </Link>
        </div>
      </div>
      <div>
        <Separator className="h-screen w-px bg-gray-200" />
      </div>
    </div>
  );
}
