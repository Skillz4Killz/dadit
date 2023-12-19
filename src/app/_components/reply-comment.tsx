"use client";

import { useAuth } from "@clerk/nextjs";
import { type Comment, type User, type CommentVote } from "@prisma/client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { timeAgo } from "~/lib/utils";

import { api } from "~/trpc/react";
import { UpVoter, DownVoter } from "./upvote";
import CommentIcon from "~/components/icons/comment";

export type CommentWithDetails = Comment & {
  votes: CommentVote[];
  author: User;
  replies: CommentWithDetails[];
};
export interface ReplyCommentProps {
  comment: CommentWithDetails;
  currentUserId?: string;
  postId: number;
  initials: string;
  avatarURL?: string | null;
  nesting?: number;
}

export function ReplyCommentForm(props: ReplyCommentProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const { userId } = useAuth();
  const [replyClicked, setReplyClicked] = useState(false);
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
      <div className="h-[84px] w-[600px] gap-3 p-0">
        <div className="flex items-start gap-2">
          {/* Post Details */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 p-0">
              <Avatar className="h-6 w-6 rounded-[100px]">
                <AvatarImage
                  className="h-6 w-6 rounded-[100px]"
                  src={
                    props.comment.author.avatarURL ??
                    "https://github.com/shadcn.png"
                  }
                />
                <AvatarFallback>
                  {props.comment.author.username?.toUpperCase().substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-normal not-italic leading-5 text-gray-600">
                {props.comment.author.username}{" "}
                {timeAgo(props.comment.createdAt)}
              </p>
            </div>
            <p className="text-sm font-normal leading-5 text-gray-800">
              {props.comment.content}
            </p>
          </div>
        </div>

        <div className="flex h-[84px] items-center gap-2.5">
          <UpVoter
            commentId={props.comment.id}
            active={props.comment.votes.some(
              (vote) => vote.upvoted && props.currentUserId === vote.userId,
            )}
          />
          <p className="text-base  font-medium leading-6 text-gray-800">
            {props.comment.votes.reduce(
              (prev, vote) => (vote.upvoted ? prev + 1 : prev - 1),
              0,
            )}
          </p>
          <DownVoter
            commentId={props.comment.id}
            active={props.comment.votes.some(
              (vote) => !vote.upvoted && props.currentUserId === vote.userId,
            )}
          />

          <div
            className="flex items-center gap-2"
            onClick={() => {
              setReplyClicked(!replyClicked);
            }}
          >
            <CommentIcon />
            <p className="text-base  font-medium leading-6 text-gray-800">
              {replyClicked ? "Cancel" : "Reply"}
            </p>
          </div>
        </div>
      </div>

      {replyClicked ? (
        <div className="mt-12 box-border flex h-fit w-[600px] flex-row items-start gap-4 rounded-xl border border-gray-200 px-4 pb-3 pt-4 shadow-[0px_8px_16px_rgba(0,0,0,0.05)]">
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
                parentId: props.comment.id,
              });
              setReplyClicked(!replyClicked);
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
      ) : null}

      {props.comment.replies?.map((reply) => (
        <div className={`mt-12 ${props.nesting ? `ml-${props.nesting * 4}`  : "ml-4"}`}>
          <ReplyCommentForm
            comment={reply}
            initials={props.initials}
            currentUserId={props.currentUserId}
            avatarURL={props.avatarURL}
            postId={props.postId}
            nesting={props.nesting ? props.nesting + 1 : 1}
          />
        </div>
      ))}
    </div>
  );
}
