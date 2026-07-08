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
} from "../ui/message";
import { Bubble, BubbleContent } from "../ui/bubble";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "@base-ui/react";
import { mockTasks } from "../../db/mock-data";

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

              <div className="flex w-full max-w-sm flex-col gap-6 ">
                <MessageGroup>
                  <Message>
                    <MessageAvatar />
                    <MessageContent>
                      <Bubble variant="default">
                        <BubbleContent className="bg-black/15">
                          I checked the registry addresses.
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                  <Message>
                    <MessageAvatar>
                      <Avatar>
                        <AvatarImage
                          src="https://media.licdn.com/dms/image/v2/D4D03AQELAnAYqblCDw/profile-displayphoto-crop_800_800/B4DZ4iT4DCIMAI-/0/1778692101193?e=1785369600&v=beta&t=YP0-pcddqhTBnybmeglwS_Q0fOWN7ASDYY0zjpl0fN8"
                          alt="@avatar"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </MessageAvatar>
                    <MessageContent>
                      <Bubble variant="muted">
                        <BubbleContent className="bg-black/15">
                          The component and example JSON now live under the UI
                          registry.
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageGroup>
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
