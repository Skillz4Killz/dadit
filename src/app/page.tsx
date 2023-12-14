import { UserButton } from "@clerk/nextjs";

import { api } from "~/trpc/server";

export default async function Home() {
  const posts = await api.post.getLatest.query();

  return (
    <main>
      <UserButton afterSignOutUrl="/" />

      <div>
        {posts.map((post) => (
          <div key={post.id}>{post.title}</div>
        ))}
      </div>
    </main>
  );
}
