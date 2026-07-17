/** @format */
import { Bookmark, Folder, ShieldAlert, Text, Trash } from "lucide-react";
import { cn, priorities, tags } from "@/lib/utils";
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
      className="w-full"
      onSubmit={handleSubmit(savingTask)}
    >
      <div
        className={cn(
          "flex gap-3 justify-between items-stretch bg-[#211E21] py-3 pr-2 rounded-2xl",
        )}
      >
        <div className={`flex w-1.5 ml-2 my-1.5 bg-white rounded-full`}></div>
        <div className="flex w-full flex-col gap-1.5">
          <span className="text-start space-y-0">
            <span className="flex gap-2 items-center justify-center">
              <Folder
                className={cn("size-4", !!errors.title && "text-red-400 ")}
              />
              <Input
                placeholder="Digite o título..."
                className={cn(
                  "font-bold placeholder:opacity-80 px-0 border-none! ring-0! pr-8 pl-1 ",
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
              icon={<Bookmark className="size-4" />}
            />
            <ComboboxSelection
              array={priorities}
              controlName="priority"
              control={control}
              icon={<ShieldAlert className="size-4" />}
            />
            <span className="flex gap-2 items-start justify-center">
              <Text className="size-4 mt-3.5" />
              <Textarea
                placeholder="Adicione a descrição..."
                className="font-light placeholder:opacity-80 px-0 border-none! ring-0! pr-6 "
                {...register("description")}
              ></Textarea>
            </span>
          </span>
        </div>
      </div>
      <div className="flex gap-2 w-full">
        <Button
          disabled={!!errors.title}
          type="submit"
          className={cn(
            "grow bg-black/10  mt-2 font-normal transition-all duration-200",
            !errors.title && " cursor-pointer hover:bg-black/40 ",
          )}
        >
          Salvar
        </Button>
        <Button
          onClick={onClose}
          className={
            "w-min bg-black/10  mt-2 font-normal hover:text-red-400 hover:bg-black/40 transition-all duration-200 cursor-pointer"
          }
        >
          <Trash />
        </Button>
      </div>
    </form>
  );
}
