import { currentUser, SignedIn } from "@clerk/nextjs";
import CreatePost from "~/components/ui/CreatePost";
import SideBar from "~/components/ui/Sidebar";
import { api } from "~/trpc/server";
import Posts from "~/components/ui/Posts";

export default async function MyPosts() {
  const user = await currentUser();
  const posts = user
    ? await api.post.getMyLatest.query({ userId: user?.id })
    : [];

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
        <SignedIn>
          <CreatePost
            initials={
              user ? `${user.firstName?.[0]}${user.lastName?.[0]}` : "ZA"
            }
            avatarURL={user?.imageUrl ?? null}
          />
        </SignedIn>
        <Posts posts={posts} user={user} />
      </div>
    </main>
  );
}
