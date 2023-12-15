import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

import { api } from "~/trpc/server";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { UpVote, DownVote } from "~/components/icons/votes";
import { timeAgo } from "~/lib/utils";

export default async function Home() {
  const posts = await api.post.getLatest.query();

  return (
    <main className="flex">
      <div>
        Sidebar
      </div>
      <UserButton afterSignOutUrl="/" />

      <div className="absolute left-[calc(50%_-_600px/2)] top-10 flex h-[950px] w-[600px] flex-col items-start gap-10 p-0">
        {posts.map((post) => (
          <div key={post.id}>
            <div className="h-[84px] w-[600px] gap-4 p-0">
              <div className="flex items-start gap-2">
                {/* Vote Counter */}
                {/* TODO: mark vote active when upvoted by user */}
                <div className="flex h-[84px] flex-col items-center gap-1">
                  <UpVote />
                  <p className="text-base  font-medium leading-6 text-gray-800">
                    {post.upvotes - post.downvotes}
                  </p>
                  <DownVote />
                </div>

                {/* Post Details */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 p-0">
                    <Avatar className="h-6 w-6 rounded-[100px]">
                      {/* TODO: dynamic ~ avatar logo */}
                      <AvatarImage src="https://github.com/shadcn.png" />
                      {/* TODO: dynamic ~ Possibly use author name? */}
                      <AvatarFallback>{post.authorId}</AvatarFallback>
                    </Avatar>
                    {/* Posted By text */}
                    <p className="text-sm font-normal not-italic leading-5 text-gray-600">
                      {/* TODO: dynamic ~ time ago */}
                      Posted by {post.author.username} {timeAgo(post.createdAt)}
                    </p>
                  </div>
                  <Link href={`/posts/${post.id}}`}>
                    <h2 className="text-base font-medium leading-6 text-gray-900">
                      {post.title}
                    </h2>
                    <p className="text-sm font-normal leading-5 text-gray-700">
                      {post.content.length > 240
                        ? `${post.content.substring(0, 240)}...`
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
    </main>
  );
}
