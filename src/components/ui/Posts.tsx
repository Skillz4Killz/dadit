import { type User } from "@clerk/nextjs/server";
import { type Post } from "@prisma/client";
import { Separator } from "~/components/ui/separator";
import PostBox from "./Post";

export interface PostsProps {
  posts: Post[];
  user: User | null;
}

export default async function Posts(props: PostsProps) {
  return (
    <div>
      {props.posts.map((post) => (
        <div key={post.id}>
          <PostBox post={post} />

          <div>
            <Separator className="h-px w-full bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
