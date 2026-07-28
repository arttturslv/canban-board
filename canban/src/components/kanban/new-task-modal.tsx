/** @format */
import { Bookmark, Folder, Save, ShieldAlert, Text, Trash } from "lucide-react";
import { cn, getPriorityColor, priorities, tags } from "@/lib/utils";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import type { UseMutateFunction } from "@tanstack/react-query";
import { useForm, type SubmitHandler } from "react-hook-form";

import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import type { priority, TaskInput } from "@/db/schemas";
import ComboboxSelection from "../combobox-selection";

interface NewTaskProps {
  projectId: string;
  columnId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: UseMutateFunction<
    void,
    Error,
    {
      task: TaskInput;
    },
    unknown
  >;
}

interface newTaskForm {
  title: string;
  tags?: string;
  priority?: priority;
  description?: string;
}

export default function NewTask({
  isOpen,
  onClose,
  onSave,
  columnId,
  projectId,
}: NewTaskProps) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<newTaskForm>({
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      priority: "low",
    },
  });
  const newTaskRef = useRef<HTMLFormElement>(null);
  const title = watch("title");
  const priority = watch("priority");

  let priorityColor = priority ? getPriorityColor(priority) : "bg-white-300";

  const savingTask: SubmitHandler<newTaskForm> = (data) => {
    onSave({
      task: {
        ...data,
        tags: data.tags ? [data.tags] : [],
        columnId: columnId,
        projectId: projectId,
        createdBy: "artur",
      },
    });
    reset();
    onClose();
  };

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        newTaskRef.current &&
        !newTaskRef.current.contains(event.target as Node) &&
        title.length === 0
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [title]);

  if (!isOpen) return null;

  return (
    <form
      ref={newTaskRef}
      className="w-full bg-[#201820] py-3 pr-2 rounded-3xl border-2 border-[#413441]"
      onSubmit={handleSubmit(savingTask)}
    >
      <div className={cn("flex gap-1 justify-between items-stretch ")}>
        <div
          className={cn("flex w-1.5 ml-2 my-1.5 rounded-full", priorityColor)}
        ></div>
        <div className="flex w-full flex-col gap-1.5">
          <span className="text-start space-y-0">
            <span className="flex gap-2 items-center justify-center">
              <Input
                placeholder="Digite o título..."
                className={cn(
                  "font-bold placeholder:opacity-80 px-0 border-none! ring-0! pr-8 pl-3 ",
                  !!errors.title && "placeholder:text-red-400 ",
                )}
                maxLength={42}
                {...register("title", { required: "O título é obrigatório!" })}
              ></Input>
            </span>

            <ComboboxSelection
              array={tags}
              controlName="tags"
              control={control}
              icon={null}
            />
            <ComboboxSelection
              array={priorities}
              controlName="priority"
              control={control}
              icon={null}
            />
            <span className="flex gap-2 items-start justify-center">
              <Textarea
                placeholder="Adicione a descrição..."
                className="font-light placeholder:opacity-80  px-0 pl-3 border-none! ring-0! pr-6 "
                {...register("description")}
              ></Textarea>
            </span>
          </span>
        </div>
      </div>
      <div className="flex gap-2 w-full pr-1 pl-3">
        <Button
          onClick={onClose}
          className={
            "w-min bg-gray-500/20  mt-2 font-normal text- hover:bg-gray-500/10 transition-all duration-200 cursor-pointer"
          }
        >
          Cancelar
        </Button>
        <Button
          disabled={!!errors.title}
          type="submit"
          className={cn(
            "grow bg-[#7B2EA8]/40 mt-2 font-normal text-white/80 transition-all duration-200",
            !errors.title && " cursor-pointer hover:bg-[#7B2EA8]/70  ",
          )}
        >
          Salvar
          <Save className="size-3.5" />
        </Button>
      </div>
    </form>
  );
}
