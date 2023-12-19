import type { Post, User, Vote } from "@prisma/client";
import Link from "next/link";
import { UpVoter, DownVoter } from "~/app/_components/upvote";
import { timeAgo } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

export interface PostProps {
    post: Post & { votes: Vote[]; author: User; };
    currentUserId?: string;
}

export default function PostBox(props: PostProps) {
  return (
    <div className="h-[84px] w-[600px] gap-4 p-0">
      <div className="flex items-start gap-2">
        <div className="flex h-[84px] flex-col items-center gap-1">
          <UpVoter
            postId={props.post.id}
            active={props.post.votes.some(
              (vote) => vote.upvoted && props.currentUserId === vote.userId,
            )}
          />
          <p className="text-base  font-medium leading-6 text-gray-800">
            {props.post.votes.reduce(
              (prev, vote) => (vote.upvoted ? prev + 1 : prev - 1),
              0,
            )}
          </p>
          <DownVoter
            postId={props.post.id}
            active={props.post.votes.some(
              (vote) => !vote.upvoted && props.currentUserId === vote.userId,
            )}
          />
        </div>

        {/* Post Details */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 p-0">
            <Avatar className="h-6 w-6 rounded-[100px]">
              <AvatarImage
                src={props.post.author.avatarURL ?? "https://github.com/shadcn.png"}
              />
              <AvatarFallback>
                {props.post.author.username.toUpperCase().substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-normal not-italic leading-5 text-gray-600">
              Posted by {props.post.author.username} {timeAgo(props.post.createdAt)}
            </p>
          </div>
          <Link href={`/posts/${props.post.id}`}>
            <h2 className="text-base font-medium leading-6 text-gray-900">
              {props.post.title}
            </h2>
            <p className="text-sm font-normal leading-5 text-gray-700">
              {props.post.content.length > 85
                ? `${props.post.content.substring(0, 85)}...`
                : props.post.content}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
