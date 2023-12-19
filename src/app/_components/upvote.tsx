"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { api } from "~/trpc/react";

interface VoteProps {
  active?: boolean;
  postId?: number;
  commentId?: number;
}

export function UpVoter(props: VoteProps) {
  const router = useRouter();
  const { userId } = useAuth();
  // In case the user signs out while on the page.
  if (!userId) return null;

  const upsertVote = api.post.upsertVote.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const upsertCommentVote = api.post.upsertCommentVote.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <div
      className="flex h-5 w-5 cursor-pointer items-center justify-center"
      onClick={() => {
        if (props.postId) {
          upsertVote.mutate({
            userId,
            upvoted: true,
            postId: props.postId,
          });
        } else if (props.commentId) {
          upsertCommentVote.mutate({
            userId,
            upvoted: true,
            commentId: props.commentId,
          });
        }

        router.refresh();
      }}
    >
      <svg
        width="16"
        height="11"
        viewBox="0 0 16 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.33325 7.66667L7.99992 1L14.6666 7.66667M4.66659 10.1665L7.99992 6.83318L11.3333 10.1665"
          stroke={props.active ? "#818cf8" : "#374151"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function DownVoter(props: VoteProps) {
  const router = useRouter();
  const { userId } = useAuth();
  // In case the user signs out while on the page.
  if (!userId) return null;

  const upsertVote = api.post.upsertVote.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const upsertCommentVote = api.post.upsertCommentVote.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <div
      className="flex h-5 w-5 cursor-pointer items-center justify-center"
      onClick={() => {
        if (props.postId) {
          upsertVote.mutate({
            userId,
            upvoted: false,
            postId: props.postId,
          });
        } else if (props.commentId) {
          upsertCommentVote.mutate({
            userId,
            upvoted: false,
            commentId: props.commentId,
          });
        }

        router.refresh();
      }}
    >
      <svg
        width="16"
        height="11"
        viewBox="0 0 16 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.3333 0.83333L7.99992 4.16666L4.66659 0.833329M1.33325 3.33333L7.99992 10L14.6666 3.33333"
          stroke={props.active ? "#818cf8" : "#374151"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
