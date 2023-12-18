"use client";

import { useAuth } from "@clerk/nextjs";
import { Separator } from "@radix-ui/react-separator";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreatePostForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { userId } = useAuth();
  // In case the user signs out while on the page.
  if (!userId) return null;

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setTitle("");
      setContent("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({
          title,
          content,
          authorId: userId,
        });
      }}
      className="flex h-[121px] w-[528px] flex-col items-start justify-center gap-1 rounded-xl p-0"
    >
      <div className="h-6 w-full text-base font-normal not-italic leading-6 text-gray-500">
        <input
          name="title"
          id="title"
          placeholder="Title of your post"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-6 w-full text-base font-normal not-italic leading-6 text-gray-500"
          minLength={1}
          maxLength={250}
          required
        />
      </div>
      <div className="w-full text-base font-normal not-italic leading-6 text-gray-500">
        <textarea
          name="content"
          id="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts with the world!"
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
          disabled={createPost.isLoading}
        >
          <p className="h-5 text-sm font-semibold not-italic leading-5 text-white">
            {createPost.isLoading ? "Posting..." : "Post"}
          </p>
        </button>
      </div>
    </form>
  );
}
