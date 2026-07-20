/** @format */

import { FileStack, Settings2, Share2 } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useProjectsMutation } from "@/hooks/use-project-mutation";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

export const KanbanHeader = ({ projectId }: { projectId: string }) => {
  const { updateProject, useProject } = useProjectsMutation();
  const { data: project } = useProject(projectId);

  const [localName, setLocalName] = useState(project?.name || "Kanban Board");

  useEffect(() => {
    if (project?.name) {
      setLocalName(project.name);
    }
  }, [project?.name]);

  const openFilterSheet = () => {
    console.log("Filter sheet opened");
  };

  const debouncedUpdate = useCallback(
    debounce((newName: string) => {
      console.log("Salvando no banco de dados:", newName);
      updateProject.mutate({ id: projectId, updates: { name: newName } });
    }, 400),
    [projectId, updateProject],
  );

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalName(value);
    debouncedUpdate(value);
  };

  const minLength = 8;
  const currentLength =
    localName.length > minLength ? localName.length : minLength;

  return (
    <div className="flex flex-col justify-between items-center  mt-4">
      <div className="flex justify-between items-center py-2 mb-2 w-full ">
        <div className="w-32"></div>
        <span className=" flex items-center justify-center gap-2 rounded-full bg-zinc-700 w-min px-4">
          <FileStack className="size-3" />
          <Input
            onChange={onChangeInput}
            style={{ width: `${currentLength + 1}ch` }}
            placeholder="Kanban Board"
            value={localName}
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
