import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(10).max(100),
        content: z.string().min(10).max(4000),
        authorId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
          authorId: input.authorId,
        },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        author: true,
        votes: true,
      },
    });
  }),

  getMyLatest: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        where: { authorId: input.userId },
        take: 20,
        include: {
          author: true,
          votes: true,
        },
      });
    }),

  upsertUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        username: z.string(),
        avatarURL: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.upsert({
        where: { userId: input.userId },
        create: {
          userId: input.userId,
          username: input.username,
          avatarURL: input.avatarURL,
        },
        update: {
          username: input.username,
          avatarURL: input.avatarURL,
        },
      });
    }),

  upsertVote: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        postId: z.number(),
        upvoted: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.vote.upsert({
        where: { voteId: { userId: input.userId, postId: input.postId } },
        create: {
          userId: input.userId,
          postId: input.postId,
          upvoted: input.upvoted,
        },
        update: {
          upvoted: input.upvoted,
        },
      });
    }),
});
