"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { CreatePostForm } from "~/app/_components/create-post";

interface CreatePostProps {
  initials: string;
  avatarURL: string | null;
}

export default function CreatePost(props: CreatePostProps) {
  return (
    <div className="box-border flex h-fit w-[600px] flex-row items-start gap-4 rounded-xl border border-gray-200 px-4 pb-3 pt-4 shadow-[0px_8px_16px_rgba(0,0,0,0.05)]">
      <div className="h-6 w-6 rounded-[100px]">
        <Avatar>
          <AvatarImage
            src={props.avatarURL ?? ""}
            className="h-6 w-6 rounded-[100px]"
          />
          <AvatarFallback className="rounded-[100px] bg-indigo-400">
            {props.initials}
          </AvatarFallback>
        </Avatar>
      </div>
      <CreatePostForm />
    </div>
  );
}
