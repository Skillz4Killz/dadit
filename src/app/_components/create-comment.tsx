"use client";

import { useAuth } from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export interface CreateCommentProps {
  postId: number;
  initials: string;
  avatarURL: string | null;
}

export function CreateCommentForm(props: CreateCommentProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const { userId } = useAuth();
  // In case the user signs out while on the page.
  if (!userId) return null;

  const createComment = api.post.comment.useMutation({
    onSuccess: () => {
      router.refresh();
      setContent("");
    },
  });

  return (
    <div>
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createComment.mutate({
              postId: props.postId,
              content,
              authorId: userId,
            });
          }}
          className="flex h-[121px] w-[528px] flex-col items-start justify-center gap-3.5 rounded-xl p-0"
        >
          <div className="w-full text-base font-normal not-italic leading-6 text-gray-500">
            <textarea
              name="content"
              id="content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comment your thoughts"
              className="w-full resize-none overflow-auto text-base font-normal not-italic leading-6 text-gray-500"
              minLength={1}
              maxLength={4000}
            />
          </div>
          <div>
            <Separator className="h-px w-[528px] bg-gray-200" />
          </div>
          <div className="flex h-9 w-[528px] cursor-pointer flex-col items-end justify-end p-0">
            <button
              type="submit"
              className="flex h-9 min-w-[55px] flex-row items-center justify-center rounded-[10px] bg-indigo-500 px-3 py-2"
              disabled={createComment.isLoading}
            >
              <p className="h-5 text-sm font-semibold not-italic leading-5 text-white">
                {createComment.isLoading ? "Commenting..." : "Comment"}
              </p>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
