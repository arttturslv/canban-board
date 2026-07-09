/** @format */

import { FileStack, Settings2, Share2 } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { useState } from "react";

export const KanbanHeader = () => {
  const [value, setValue] = useState("");
  const openFilterSheet = () => {
    console.log("Filter sheet opened");
  };

  const minLength = 12;
  const currentLength = value.length > minLength ? value.length : minLength;

  return (
    <div className="flex flex-col justify-between items-center  mt-4">
      <div className="flex justify-between items-center py-2 w-full ">
        <div className="w-32"></div>
        <span className=" flex items-center justify-center gap-2 rounded-full bg-zinc-700 w-min px-4">
          <FileStack className="size-3" />
          <Input
            onChange={(e) => setValue(e.target.value)}
            style={{ width: `${currentLength + 1}ch` }}
            placeholder="Kanban Board"
            className={cn(
              "text-zinc-100 placeholder:text-zinc-100   ring-0! border-0!  p-0! rounded-md h-7",
            )}
            maxLength={42}
          ></Input>
        </span>
        <div className="flex gap-2 w-32">
          <button
            onClick={openFilterSheet}
            className="px-3 py-0.5 flex text-sm border-px border-purple-500 text-purple-200 items-center justify-center gap-1 hover:opacity-80 transition-opacity bg-purple-500/30 rounded-full duration-200 cursor-pointer"
          >
            Share
            <Share2 className="size-3" />
          </button>

          <button
            onClick={openFilterSheet}
            className="px-3 py-0.5 flex text-sm border-px border-gray-500 text-gray-200 items-center justify-center gap-1 hover:opacity-80 transition-opacity bg-gray-500/30 rounded-full duration-200 cursor-pointer"
          >
            <Settings2 className="size-3" />
          </button>
        </div>
      </div>

      <span className="bg-zinc-800 h-px w-full opacity-90" />
    </div>
  );
};
