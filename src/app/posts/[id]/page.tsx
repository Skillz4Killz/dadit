import { currentUser, SignedIn } from "@clerk/nextjs";
import SideBar from "~/components/ui/Sidebar";
import { api } from "~/trpc/server";
import GoBackIcon from "~/components/icons/back";
import { CreateCommentForm } from "~/app/_components/create-comment";
import PostBox from "~/components/ui/Post";
import { ReplyCommentForm } from "~/app/_components/reply-comment";
import Divider from "~/components/ui/Divider";

export default async function PostPage({ params }: { params: { id: string } }) {
  const postId = parseInt(params.id);
  if (isNaN(postId)) {
    throw new Error(`Invalid post id! ${params.id}`);
  }

  console.log('in post page, getting user')
  const user = await currentUser();
  console.log('user found', user)
  const post = await api.post.getPostWithComments.query({ postId });
  if (!post) {
    throw new Error(`Post not found! ${params.id}`);
  }

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

      <div className="no-scrollbar absolute left-[calc(50%_-_600px/2)] top-10 flex h-[950px] w-[600px] flex-col items-start gap-10 overflow-y-scroll p-0">
        <div className="flex h-5 w-32 flex-row items-center gap-4 p-0">
          <GoBackIcon />
          <p className="h-5 w-[92px] text-sm font-medium not-italic leading-5 text-gray-800">
            Back to posts
          </p>
        </div>

        <PostBox post={post} currentUserId={user?.id} />
        <SignedIn>
          <CreateCommentForm
            initials={
              user ? `${user.firstName?.[0]}${user.lastName?.[0]}` : "ZA"
            }
            avatarURL={user?.imageUrl ?? null}
            postId={postId}
          />
        </SignedIn>

        <Divider />

        <p>{post.comments.length ? "All comments" : "No comments"}</p>

        {post.comments.map((comment) =>
          comment.parentId ? null : (
            <div key={comment.id}>
              <ReplyCommentForm
                comment={comment}
                initials={
                  user ? `${user.firstName?.[0]}${user.lastName?.[0]}` : "ZA"
                }
                currentUserId={user?.id}
                avatarURL={user?.imageUrl}
                postId={postId}
              />
            </div>
          ),
        )}
      </div>
    </main>
  );
}
