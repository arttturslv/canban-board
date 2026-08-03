/** @format */

import {
  Bell,
  EllipsisVertical,
  FileStack,
  LogOut,
  Share2,
} from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useProjectsMutation } from "@/hooks/use-project-mutation";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "@tanstack/react-router";
import { ProfileModal } from "../profile-dialog";
import { ShareModal } from "../share-dialog";

export const KanbanHeader = ({ project_id }: { project_id: string }) => {
  const { updateProject, useProject } = useProjectsMutation();
  const { data: project } = useProject(project_id);
  const router = useRouter();

  const [localName, setLocalName] = useState(project?.name || "Kanban Board");
  const [showShared, setShowShared] = useState(false);

  useEffect(() => {
    if (project?.name) {
      setLocalName(project.name);
    }
  }, [project?.name]);

  const openFilterSheet = () => {
    console.log("Filter sheet opened");
  };

  const debouncedUpdate = useMemo(() => {
    return debounce((newName: string, project_id: string) => {
      updateProject.mutate({ id: project_id, updates: { name: newName } });
    }, 700);
  }, [updateProject]);

  const onChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalName(value);
      debouncedUpdate(value, project_id);
    },
    [project_id],
  );

  const minLength = 8;
  const currentLength =
    localName.length > minLength ? localName.length : minLength;

  const logout = () => {
    logoutService();
    router.navigate({ to: "/", replace: true });
  };

  const { logout: logoutService } = useAuthStore();

  return (
    <div className="flex flex-col justify-between items-center  sm:mt-4 mt-2">
      <div className="sm:flex justify-between items-center py-2 mb-2 px-4 w-full max-sm:space-y-2">
        <a
          href="/"
          className="sm:w-32 w-full max-sm:pb-3 justify-center flex gap-2 items-center"
        >
          <img
            src="/logo-inline.png"
            className="flex h-7  items-center justify-center  "
          ></img>
        </a>
        <span className=" flex items-center justify-center gap-2 rounded-full h-8 bg-[#7B2EA8]/40 text-white/80 sm:w-min w-full px-4">
          <FileStack className="size-3" />
          <Input
            onChange={onChangeInput}
            style={{ width: `${currentLength + 1}ch` }}
            placeholder="Kanban Board"
            value={localName}
            className={cn(
              " placeholder:text-zinc-100   ring-0! border-0!  p-0! rounded-md h-7",
            )}
            maxLength={42}
          ></Input>
        </span>
        <div className="flex gap-2 max-sm:justify-end">
          <button
            onClick={() => setShowShared(true)}
            className="max-sm:p-0! max-sm:size-8 px-3  disabled:opacity-30 disabled:cursor-not-allowed h-8    flex text-sm border-px  text-purple-200 items-center justify-center gap-1 hover:contrast-125 transition-opacity bg-[#7B2EA8]/40 rounded-full duration-200 cursor-pointer"
          >
            <span className="max-sm:hidden">Compartilhar</span>
            <Share2 className="size-4" />
          </button>

          <button
            disabled

            onClick={openFilterSheet}
            className="p-0! m-0! size-8  text-sm  disabled:opacity-30 disabled:cursor-not-allowed flex text-gray-200 items-center justify-center hover:opacity-80 transition-opacity bg-gray-500/30 rounded-full duration-200 cursor-pointer"
          >
            <Bell className="size-4" />
          </button>

          <ProfileModal>
            <button className="p-0! m-0! size-8  text-sm  flex text-gray-200 items-center justify-center hover:opacity-80 transition-opacity bg-gray-500/30 rounded-full duration-200 cursor-pointer">
              <EllipsisVertical className="size-4" />
            </button>
          </ProfileModal>
          <ShareModal
            projectId={project_id}
            show={showShared}
            onClose={() => setShowShared(false)}
          />
          <button
            onClick={logout}
            className="p-0! m-0! size-8  text-sm  flex text-gray-200 items-center justify-center hover:contrast-125 transition-opacity bg-[#7B2EA8]/40 rounded-full duration-200 cursor-pointer"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
