/** @format */

import { db } from "../dexie-db";
import type { Comment, CommentAgregated, CommentInput } from "../schemas/index";

export const CommentService = {
  async getComments(taskId: string): Promise<CommentAgregated[]> {
    const comments = await db.comments.where("taskId").equals(taskId).toArray();

    if (comments.length === 0) return [];

    comments.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const userIds = [...new Set(comments.map((c) => c.createdBy))];
    const users = await db.profiles.where("id").anyOf(userIds).toArray(); //
    const userMap = new Map(users.map((u) => [u.id, u]));

    return comments.map((comment) => {
      const user = userMap.get(comment.createdBy);

      return {
        ...comment,
        author: {
          id: comment.createdBy,
          name: user?.name || "Usuário desconhecido",
          avatarUrl: user?.avatarUrl || null,
        },
      };
    });
  },

  async createComment(newComment: CommentInput) {
    const defaultCommentId = crypto.randomUUID();

    const comment: Comment = {
      id: crypto.randomUUID(),
      ...newComment,
      reactions: [],
      readByIds: [newComment.createdBy],
    };

    await db.comments.add(comment);

    return { id: defaultCommentId };
  },
};
