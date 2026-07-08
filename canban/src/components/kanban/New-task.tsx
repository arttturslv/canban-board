/** @format */
import { Bookmark, Folder, ShieldAlert, Text } from "lucide-react";
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

export default function NewTask() {
  const savingTask = (e: any) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      console.log("Saving new task");
    }
  };

  return (
    <div
      onBlur={savingTask}
      className={cn(
        "flex gap-3 justify-between w-full items-stretch bg-[#211E21] py-3 pr-2 rounded-2xl",
      )}
    >
      <div className={`flex w-1.5 ml-2 my-1.5 bg-white rounded-full`}></div>
      <div className="flex w-full flex-col gap-1.5">
        <span className="text-start space-y-0">
          <span className="flex gap-2 items-center justify-center">
            <Folder className="size-4" />
            <Input
              placeholder="Digite o título..."
              className="font-bold placeholder:opacity-80 px-0 border-none! ring-0! pr-8 "
              maxLength={42}
            ></Input>
          </span>

          <TagsSelection />
          <PrioritiesSelector />
          <span className="flex gap-2 items-start justify-center">
            <Text className="size-4 mt-3.5" />
            <Textarea
              placeholder="Adicione a descrição..."
              className="font-light placeholder:opacity-80 px-0 border-none! ring-0! pr-6 "
            ></Textarea>
          </span>
        </span>
      </div>
    </div>
  );
}

const priorities = ["low", "medium", "high", "urgent"];

export function PrioritiesSelector() {
  return (
    <Combobox items={priorities}>
      <div className="flex  items-center ">
        <ShieldAlert className="size-4" />

        <ComboboxInput
          className={"px-0! mx-0! ring-0! w-full "}
          placeholder="Select a framework"
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
  );
}

const tags = ["UI/UX", "Backend", "Frontend", "IA", "Database", "RH", "Client"];
export function TagsSelection() {
  return (
    <Combobox items={tags}>
      <div className="flex items-center ">
        <Bookmark className="size-4" />

        <ComboboxInput
          className={"px-0! mx-0! ring-0! w-full "}
          placeholder="Select a framework"
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
  );
}
