import { type User as ClerkUser } from "@clerk/nextjs/server";
import { type Vote, type Post, type User } from "@prisma/client";
import { Separator } from "~/components/ui/separator";
import PostBox from "./Post";

export interface PostsProps {
  posts: (Post & { votes: Vote[]; author: User })[];
  user: ClerkUser | null;
}

export default async function Posts(props: PostsProps) {
  return (
    <div>
      {props.posts.map((post) => (
        <div key={post.id}>
          <PostBox post={post} currentUserId={props.user?.id} />

          <div>
            <Separator className="h-px w-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
