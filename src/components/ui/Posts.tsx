import { User } from "@clerk/nextjs/server";
import { type Post } from "@prisma/client";
import Link from "next/link";
import { DownVoter, UpVoter } from "~/app/_components/upvote";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { timeAgo } from "~/lib/utils";

export interface PostsProps {
  posts: Post[];
  user: User | null;
}

export default async function Posts(props: PostsProps) {
  return (
    <div>
      {props.posts.map((post) => (
        <div key={post.id}>
          <div className="h-[84px] w-[600px] gap-4 p-0">
            <div className="flex items-start gap-2">
              <div className="flex h-[84px] flex-col items-center gap-1">
                <UpVoter
                  postId={post.id}
                  active={post.votes.some(
                    (vote) => vote.upvoted && props.user?.id === vote.userId,
                  )}
                />
                <p className="text-base  font-medium leading-6 text-gray-800">
                  {post.votes.reduce(
                    (prev, vote) => (vote.upvoted ? prev + 1 : prev - 1),
                    0,
                  )}
                </p>
                <DownVoter
                  postId={post.id}
                  active={post.votes.some(
                    (vote) => !vote.upvoted && props.user?.id === vote.userId,
                  )}
                />
              </div>

              {/* Post Details */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 p-0">
                  <Avatar className="h-6 w-6 rounded-[100px]">
                    <AvatarImage
                      src={
                        post.author.avatarURL ?? "https://github.com/shadcn.png"
                      }
                    />
                    <AvatarFallback>
                      {post.author.username.toUpperCase().substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-normal not-italic leading-5 text-gray-600">
                    Posted by {post.author.username} {timeAgo(post.createdAt)}
                  </p>
                </div>
                <Link href={`/posts/${post.id}}`}>
                  <h2 className="text-base font-medium leading-6 text-gray-900">
                    {post.title}
                  </h2>
                  <p className="text-sm font-normal leading-5 text-gray-700">
                    {post.content.length > 85
                      ? `${post.content.substring(0, 85)}...`
                      : post.content}
                  </p>
                </Link>
              </div>
            </div>
          </div>
          <div>
            <Separator className="h-px w-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
