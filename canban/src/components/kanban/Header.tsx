/** @format */

import { FileStack, LogOut, Settings2, Share2 } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useProjectsMutation } from "@/hooks/use-project-mutation";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LoginDialog } from "../login-dialog";
import { useAuthStore } from "@/store/use-auth-store";
import { Button } from "../ui/button";

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

  const debouncedUpdate = useMemo(() => {
    return debounce((newName: string, projectId: string) => {
      updateProject.mutate({ id: projectId, updates: { name: newName } });
    }, 700);
  }, [updateProject]);

  const onChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalName(value);
      debouncedUpdate(value, projectId);
    },
    [projectId],
  );

  const minLength = 8;
  const currentLength =
    localName.length > minLength ? localName.length : minLength;

  const { user, logout } = useAuthStore();

  return (
    <div className="flex flex-col justify-between items-center  sm:mt-4 mt-2">
      <div className="sm:flex justify-between items-center py-2 mb-2 px-4 w-full ">
        <div className="sm:w-32 w-full max-sm:pb-3 justify-center flex gap-2 items-center">
          <img src="https://i.imgur.com/jBbbWDt.png" className="size-8" />
          <h1 className="font-black text-[#9b5fcc]">Canban</h1>
        </div>
        <span className=" flex items-center justify-center gap-2 rounded-full bg-zinc-700 sm:w-min w-full px-4">
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
        <div className=" gap-2 min-w-32 flex ">
          {user && (
            <div className="flex gap-2">
              <button
                onClick={openFilterSheet}
                className="px-3 flex py-0.5  text-sm border-px border-purple-500 text-purple-200 items-center justify-center gap-1 hover:opacity-80 transition-opacity bg-purple-500/30 rounded-full duration-200 cursor-pointer"
              >
                Share
                <Share2 className="size-3" />
              </button>

              <button
                onClick={openFilterSheet}
                className="px-3 py-0.5   text-sm border-px border-gray-500 text-gray-200 items-center justify-center gap-1 hover:opacity-80 transition-opacity bg-gray-500/30 rounded-full duration-200 cursor-pointer"
              >
                <Settings2 className="size-3" />
              </button>
            </div>
          )}

          {user ? (
            <Button
              className="px-3 py-0.5  border-0  text-sm border-px border-gray-500 text-gray-200 items-center justify-center gap-1 hover:opacity-80 transition-opacity bg-gray-500/30 rounded-full duration-200 cursor-pointer"
              onClick={logout}
            >
              <LogOut className="size-3" />
            </Button>
          ) : (
            <LoginDialog />
          )}
        </div>
      </div>

      <span className="bg-zinc-800 h-px w-full opacity-90" />
    </div>
  );
};
