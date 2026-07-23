/** @format */
import { SendHorizonal } from "lucide-react";

import { Textarea } from "./ui/textarea";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import type { Profile } from "@/db/schemas";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "./ui/message";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bubble, BubbleContent } from "./ui/bubble";
import { map } from "lodash";
import { useState } from "react";
import { useComments } from "@/hooks/use-comments";

interface CommentsSectionProps {
  projectId: string;
  taskId: string;
  user: Profile;
}

export const CommentsSection = ({
  projectId,
  taskId,
  user,
}: CommentsSectionProps) => {
  const [newComment, setNewComment] = useState("");
  const { comments, submitting, addComment } = useComments(projectId, taskId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await addComment(newComment, user.id);
    setNewComment("");
  };

  return (
    <span className="flex gap-2 flex-col">
      <span className="flex text-sm font-medium items-center">Comentários</span>

      <div className="flex flex-col w-full ">
        {map(comments, (message, index) => {
          const isCurrentUser = message.author.id === user.id;
          const sequentialMessage =
            comments[index]?.author?.id === comments[index + 1]?.author?.id ||
            comments[index - 1]?.author?.id === message?.author?.id;

          return (
            <Message
              className={cn(sequentialMessage ? "my-0.5" : "my-3")}
              align={isCurrentUser ? "end" : "start"}
              key={message.id}
            >
              <MessageAvatar>
                <Avatar>
                  <AvatarImage src={message.author.avatarUrl || undefined} />
                  <AvatarFallback className="bg-black/20">
                    {message.author.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </MessageAvatar>

              <MessageContent>
                {!isCurrentUser && (
                  <MessageHeader className="font-light opacity-90">
                    {message.author.name}
                  </MessageHeader>
                )}

                <Bubble>
                  <BubbleContent
                    className={cn(
                      isCurrentUser ? "bg-black/10" : "bg-blue-200/20",
                    )}
                  >
                    {message.content}
                  </BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          );
        })}
      </div>

      <div className="flex gap-1 text-sm">
        <Avatar>
          <AvatarImage src={user.avatarUrl || undefined} />
          <AvatarFallback className="bg-black/20">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Adicione um comentário..."
          className="font-light placeholder:opacity-80 border-none! py-2! px-1 ring-0! pr-6  "
        ></Textarea>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !newComment.trim()}
          className="rounded-full bg-zinc-800/40 p-1.5 h-min hover:opacity-80 cursor-pointer"
        >
          {submitting ? (
            <SendHorizonal className="size-4  animate-pulse" />
          ) : (
            <SendHorizonal className="size-4  " />
          )}
        </Button>
      </div>
    </span>
  );
};
