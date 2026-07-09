/** @format */
import { Bookmark, Folder, ShieldAlert, Text, Trash } from "lucide-react";
import { cn } from "../../lib/utils";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import type { UseMutateFunction } from "@tanstack/react-query";
import type { TaskInput, taskPriority } from "../../db/schema";
import {
  Controller,
  useForm,
  type Control,
  type SubmitHandler,
} from "react-hook-form";

import { Button } from "../ui/button";

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
  priority?: taskPriority;
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

  if (!isOpen) return null;

  return (
    <form className="w-full" onSubmit={handleSubmit(savingTask)}>
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

            <TagsSelection control={control} />
            <PrioritiesSelector control={control} />
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

interface CustomFormComboboxControl {
  control: Control<newTaskForm>;
}

export function PrioritiesSelector({ control }: CustomFormComboboxControl) {
  const priorities: taskPriority[] = ["low", "medium", "high", "urgent"];

  return (
    <Controller
      name="priority"
      control={control}
      render={({ field }) => (
        <Combobox
          items={priorities}
          value={field.value}
          onValueChange={(val) => field.onChange(val)}
        >
          <div className="flex  items-center ">
            <ShieldAlert className="size-4" />

            <ComboboxInput
              className={"px-0! mx-0! ring-0! w-full "}
              placeholder="Select a framework"
              ref={field.ref}
            />
            <ComboboxContent className={"px-0!  mx-0! bg-[#161416] ring-0! "}>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem
                    className={"text-white font-normal"}
                    key={item}
                    value={item}
                  >
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </div>
        </Combobox>
      )}
    ></Controller>
  );
}

export function TagsSelection({ control }: CustomFormComboboxControl) {
  const tags = [
    "UI/UX",
    "Backend",
    "Frontend",
    "IA",
    "Database",
    "RH",
    "Client",
    "Pesquisa",
  ];

  return (
    <Controller
      name="tags"
      control={control}
      render={({ field }) => (
        <Combobox
          value={field.value}
          onValueChange={(val) => field.onChange(val)}
          items={tags}
        >
          <div className="flex items-center ">
            <Bookmark className="size-4" />

            <ComboboxInput
              className={"px-0! mx-0! ring-0! w-full "}
              placeholder="Select a framework"
              ref={field.ref}
            />
            <ComboboxContent className={"px-0!  mx-0! bg-[#161416] ring-0! "}>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem
                    className={"text-white font-normal"}
                    key={item}
                    value={item}
                  >
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </div>
        </Combobox>
      )}
    ></Controller>
  );
}
