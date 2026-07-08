/** @format */
import {
  BookMarked,
  Calendar,
  Folder,
  ShieldAlert,
  User,
  Text,
  SendHorizonal,
} from "lucide-react";
import { Sheet, SheetContent } from "../ui/sheet";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
  MessageHeader,
} from "../ui/message";
import { Bubble, BubbleContent } from "../ui/bubble";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "@base-ui/react";
import { messages, mockTasks, users } from "../../db/mock-data";
import { cn } from "../../lib/utils";

interface EditTaskSheetProps {
  taskId: string | null;
  open: boolean;
  onClose: () => void;
}

interface taskForm {
  title: string;
  tag?: string;
  dueDate?: string;
  priority?: string;
  assignee?: string;
  description?: string;
}

export default function EditTaskSheet({
  onClose,
  open,
  taskId,
}: EditTaskSheetProps) {
  const taskFound = taskId
    ? mockTasks.find((item) => item.id === taskId)
    : null;

  const taskMessages = taskId
    ? messages.filter((m) => m.taskId === taskId)
    : [];

  const { register, handleSubmit } = useForm<taskForm>({
    values: {
      title: taskFound?.title ?? "",
      assignee: taskFound?.assignee ?? "",
      dueDate: taskFound?.dueDate ?? "",
      priority: taskFound?.priority ?? "",
      tag: taskFound?.tag ?? "",
      description: taskFound?.description ?? "",
    },
  });

  const onSubmit: SubmitHandler<taskForm> = (data) => console.log(data);

  return (
    <Sheet onOpenChange={onClose} open={open}>
      <SheetContent
        className={"w-200! bg-[#3E3D44] max-w-none! text-white pt-16 border-0!"}
      >
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <div className=" px-6 space-y-3 h-full grow flex flex-col">
            <span className="flex gap-2 items-center justify-center bg-[#2C2828] rounded-xl px-3">
              <Folder className="size-4" />
              <Input
                placeholder="Digite o título..."
                className="font-bold placeholder:opacity-80 px-0 border-none! ring-0! pr-8 "
                maxLength={42}
                {...register("title")}
              ></Input>
            </span>

            <div className="flex gap-2">
              <span className="flex gap-2 flex-col">
                <span className="flex gap-1 items-center">
                  <BookMarked className="size-4" /> Categoria
                </span>
                <Input
                  placeholder="Sem categoria"
                  className=" bg-[#2C2828] border-none! rounded-xl ring-0! pr-8 "
                  maxLength={42}
                  {...register("tag")}
                ></Input>
              </span>

              <span className="flex gap-2 flex-col">
                <span className="flex gap-1 items-center">
                  <Calendar className="size-4" /> Data
                </span>
                <Input
                  placeholder="Sem data"
                  className=" bg-[#2C2828] border-none! rounded-xl ring-0! pr-8 "
                  maxLength={42}
                  {...register("dueDate")}
                ></Input>
              </span>

              <span className="flex gap-2 flex-col">
                <span className="flex gap-1 items-center">
                  <ShieldAlert className="size-4" /> Prioridade
                </span>
                <Input
                  placeholder="Sem prioridade"
                  className=" bg-[#2C2828] border-none! rounded-xl ring-0! pr-8 "
                  maxLength={42}
                  {...register("priority")}
                ></Input>
              </span>

              <span className="flex gap-2 flex-col">
                <span className="flex gap-1 items-center">
                  <User className="size-4" /> Responsável
                </span>
                <Input
                  placeholder="Sem categoria"
                  className=" bg-[#2C2828] border-none! rounded-xl ring-0! pr-8 "
                  maxLength={42}
                  {...register("assignee")}
                ></Input>
              </span>
            </div>

            <span className="flex gap-2 flex-col">
              <span className="flex gap-1 items-center">
                <Text className="size-4" /> Descrição
              </span>
              <Textarea
                placeholder="Adicione a descrição..."
                className="font-light placeholder:opacity-80  border-none! ring-0! pr-6 bg-[#2C2828] "
                {...register("description")}
              ></Textarea>
            </span>

            <span className="flex gap-2 flex-col">
              <span className="flex text-sm font-medium items-center">
                Comentários
              </span>

              <div className="flex flex-col  w-full gap-6 ">
                {taskMessages.map((message) => {
                  const author = users.find(
                    (user) => user.id === message.authorId,
                  )!;
                  const isCurrentUser = author.id === "user-1";

                  return (
                    <Message
                      align={isCurrentUser ? "end" : "start"}
                      key={message.id}
                    >
                      <MessageAvatar>
                        <Avatar>
                          <AvatarImage src={author.avatar} />
                          <AvatarFallback className="bg-black/20">
                            {author.name[0]}
                          </AvatarFallback>
                        </Avatar>
                      </MessageAvatar>

                      <MessageContent>
                        <MessageHeader className="font-light opacity-90">
                          {author.name}
                        </MessageHeader>

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

              <span className="flex gap-1 text-sm">
                <div className="size-8 shrink-0 rounded-full bg-black/60 mt-1" />
                <Textarea
                  placeholder="Adicione um comentário..."
                  className="font-light placeholder:opacity-80 border-none! py-2! px-1 ring-0! pr-6  "
                ></Textarea>
                <Button className="rounded-full bg-zinc-800/40 p-1.5 h-min hover:opacity-80 cursor-pointer">
                  <SendHorizonal className="size-4  " />
                </Button>
              </span>
            </span>
          </div>

          <div className=" h-full flex items-center">
            <Button type="submit" className={"bg-green-700 w-full py-2"}>
              Save
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
