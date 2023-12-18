import Link from "next/link";

import { api } from "~/trpc/server";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { timeAgo } from "~/lib/utils";
import SideBar from "~/components/ui/Sidebar";
import { SignedIn, currentUser } from "@clerk/nextjs";
import CreatePost from "~/components/ui/CreatePost";
import { DownVoter, UpVoter } from "./_components/upvote";

export default async function Home() {
  const posts = await api.post.getLatest.query();
  const user = await currentUser();

  if (user) {
    await api.post.upsertUser.mutate({
      avatarURL: user.imageUrl,
      userId: user.id,
      username: `${user.username ?? user.firstName}`,
    });
  }

  return (
    <main className="flex">
      <SideBar username={user ? `${user.firstName} ${user.lastName}` : null} />

      <div className="absolute left-[calc(50%_-_600px/2)] top-10 flex h-[950px] w-[600px] flex-col items-start gap-10 p-0">
        <SignedIn>
          <CreatePost
            initials={
              user ? `${user.firstName?.[0]}${user.lastName?.[0]}` : "ZA"
            }
            avatarURL={user?.imageUrl ?? null}
          />
        </SignedIn>
        {posts.map((post) => (
          <div key={post.id}>
            <div className="h-[84px] w-[600px] gap-4 p-0">
              <div className="flex items-start gap-2">
                <div className="flex h-[84px] flex-col items-center gap-1">
                  <UpVoter
                    postId={post.id}
                    active={post.votes.some(
                      (vote) => vote.upvoted && user.id === vote.userId,
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
                      (vote) => !vote.upvoted && user.id === vote.userId,
                    )}
                  />
                </div>

                {/* Post Details */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 p-0">
                    <Avatar className="h-6 w-6 rounded-[100px]">
                      <AvatarImage
                        src={
                          post.author.avatarURL ??
                          "https://github.com/shadcn.png"
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
    </main>
  );
}
