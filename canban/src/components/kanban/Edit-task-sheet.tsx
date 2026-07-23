/** @format */
import {
  BookMarked,
  Calendar as CalendarIcon,
  Folder,
  ShieldAlert,
  User as UserIcon,
  Text,
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
import { useAuthStore } from "@/store/use-auth-store";
import { CommentsSection } from "../comment-section";
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

  const { user, profile } = useAuthStore();

  return (
    <Sheet onOpenChange={onClose} open={open}>
      <SheetContent
        showCloseButton={false}
        className={
          "w-200! h-full  bg-linear-to-t from-[#21172e] to-[#36353b] max-w-none! text-white pt-16 border-0!"
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
                  <UserIcon className="size-4" /> Responsável
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
            {user && taskId && profile && (
              <CommentsSection
                user={profile}
                projectId={projectId}
                taskId={taskId}
              />
            )}
          </div>

          <div className=" flex items-center m-4">
            <Button
              disabled={disabled}
              type="submit"
              className={
                "bg-[#3d2c49] hover:bg-[#2f2238] cursor-pointer transition-all duration-200 rounded-lg w-full py-2"
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
