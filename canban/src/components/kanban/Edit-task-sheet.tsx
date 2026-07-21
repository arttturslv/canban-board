/** @format */
import {
  BookMarked,
  Calendar as CalendarIcon,
  Folder,
  ShieldAlert,
  User,
  Text,
  SendHorizonal,
  X,
  Trash,
} from "lucide-react";
import { Sheet, SheetContent } from "../ui/sheet";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { priorities, tags } from "@/lib/utils";
import { useTaskMutations } from "../../hooks/use-task-mutation";
import { Button } from "../ui/button";
import { DatePicker } from "../date-picker";
import ComboboxSelection from "../combobox-selection";
import { ConfirmationModal } from "../confirmation-dialog";
import type { priority, taskForm } from "@/db/schemas";

interface EditTaskSheetProps {
  projectId: string;
  taskId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function EditTaskSheet({
  onClose,
  open,
  taskId,
  projectId,
}: EditTaskSheetProps) {
  const { updateTask, deleteTask, useTask } = useTaskMutations(projectId);
  const { data: taskFound } = useTask(taskId);

  const {
    register,
    handleSubmit,
    control,
    formState: { disabled },
  } = useForm<taskForm>({
    values: {
      title: taskFound?.title ?? "",
      assignee: taskFound?.assignee ?? "",
      dueDate: taskFound?.dueDate ?? "",
      priority: taskFound?.priority ?? "",
      tag: taskFound?.tags[0] ?? "",
      description: taskFound?.description ?? "",
    },
  });

  const onSubmit: SubmitHandler<taskForm> = (data) => {
    if (!taskId) return;

    const { mutate: updateTaskFn, error } = updateTask;

    updateTaskFn({
      id: taskId,
      updates: {
        ...data,
        priority: (data.priority || "low") as priority,
      },
    });

    if (error) {
      console.error(error);
    }
    onClose();
  };

  const onDelete = () => {
    if (!taskId) return;

    const { mutate: deleteTaskFn, error } = deleteTask;

    deleteTaskFn({ taskId });

    if (error) {
      console.error(error);
    }
    onClose();
  };

  return (
    <Sheet onOpenChange={onClose} open={open}>
      <SheetContent
        showCloseButton={false}
        className={
          "w-200! h-full  bg-linear-to-t from-[#261a35] to-[#36353b] max-w-none! text-white pt-16 border-0!"
        }
      >
        <div className="absolute top-3 right-3 flex gap-2">
          <div className="cursor-pointer hover:text-red-400 duration-200 transition-all">
            <ConfirmationModal
              title="Deletar Task"
              action={onDelete}
              description="As tarefas deletadas não podem ser recuperadas"
            >
              <button className="mt-1.5">
                <Trash className="size-3.5 " />
              </button>
            </ConfirmationModal>
          </div>
          <button onClick={onClose} className="cursor-pointer">
            <X className="size-4.5" />
          </button>
        </div>
        <form
          className="h-full flex flex-col justify-between"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className=" px-6 space-y-3  flex flex-col ">
            <span className="flex gap-2 items-center justify-center bg-[#252323] rounded-xl px-3">
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
                <ComboboxSelection
                  array={tags}
                  controlName="tag"
                  control={control}
                />
              </span>

              <span className="flex gap-2 flex-col">
                <span className="flex gap-1 items-center ">
                  <CalendarIcon className="size-4" /> Data
                </span>
                <DatePicker control={control} controlName={"dueDate"} />
              </span>

              <span className="flex gap-2 flex-col">
                <span className="flex gap-1 items-center">
                  <ShieldAlert className="size-4" /> Prioridade
                </span>
                <ComboboxSelection
                  array={priorities}
                  controlName="priority"
                  control={control}
                />
              </span>

              <span className="flex gap-2 flex-col">
                <span className="flex gap-1 items-center">
                  <User className="size-4" /> Responsável
                </span>
                <Input
                  placeholder="Sem responsável"
                  className=" bg-[#252323] border-none! rounded-xl ring-0! pr-8 "
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
                className="font-light placeholder:opacity-80  border-none! ring-0! pr-6 bg-[#252323] "
                {...register("description")}
              ></Textarea>
            </span>

            <span className="flex gap-2 flex-col">
              <span className="flex text-sm font-medium items-center">
                Comentários
              </span>

              <div className="flex flex-col  w-full gap-6 ">
                {/* {taskMessages.map((message) => {
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
                })} */}
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

          <div className=" flex items-center m-4">
            <Button
              disabled={disabled}
              type="submit"
              className={
                "bg-[#252323] hover:bg-[#1b1919] cursor-pointer transition-all duration-200 rounded-lg w-full py-2"
              }
            >
              Salvar
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
