/** @format */

export interface Comment {
  id: string;
  projectId: string;
  taskId: string;

  content: string;
  attachments: string[];

  reactions: CommentReaction[];
  readByIds: string[];
  createdAt: string;
  createdBy: string;
}

export type CommentInput = Omit<Comment, "reactions" | "readByIds" | "id">;

export type CommentReactionInput = {
  commentId: string;
  userId: string;
  reaction: string;
};

export interface CommentReaction {
  userId: string;
  reaction: string;
}

export type CommentAgregated = Comment & {
  author: {
    id: string;
    avatarUrl: string | null;
    name: string | null;
  };
};
