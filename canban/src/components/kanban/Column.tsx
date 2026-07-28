/** @format */

import { Plus, Trash } from "lucide-react";
import { TaskItem } from "./Task-item";
import NewTask from "./new-task-modal";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useTaskMutations } from "../../hooks/use-task-mutation";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import type { TaskResponse } from "@/db/schemas";
import { useColumnMutation } from "@/hooks/use-column-mutation";
import { debounce } from "lodash";
import { Input } from "@base-ui/react";
interface ColumnProps {
  id: string;
  title: string;
  taskAction: (taskId: string) => void;
  tasks: TaskResponse[];
  projectId: string;
}
export const Column = memo(function Column({
  id,
  title,
  taskAction,
  tasks,
  projectId,
}: ColumnProps) {
  const { createTask } = useTaskMutations(projectId);
  const [showNewTask, setShowNewTask] = useState(false);
  const { ref, isDropTarget } = useDroppable({
    id,
    type: "column",
    accept: "task",
    collisionPriority: CollisionPriority.Low,
  });
  const addNewTask = () => {
    setShowNewTask(true);
  };

  const taskCount = tasks.length;

  const { updateColumn } = useColumnMutation();

  const [localTitle, setLocalTitle] = useState(title);

  useEffect(() => {
    if (title) {
      setLocalTitle(title);
    }
  }, [title]);

  const debouncedUpdate = useMemo(() => {
    return debounce((newName: string, id: string) => {
      updateColumn.mutate({ id, updates: { title: newName } });
    }, 700);
  }, [updateColumn]);

  const onChangeInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalTitle(value);
      debouncedUpdate(value, id);
    },
    [id],
  );

  const softDeleteColumn = () => {
    if (taskCount !== 0) return;
    updateColumn.mutate({ id, updates: { visibility: false } });
  };

  return (
    <div
      ref={ref}
      className={cn(
        " w-[25vw]  bg-linear-to-t from-[#50396e42] to-[#36353b] p-4 rounded-3xl h-full transition-all duration-200 shrink-0 max-sm:min-w-[80vw] md:min-w-[50vw] lg:min-w-0",
        isDropTarget && "bg-[#333236]",
      )}
    >
      <div className="flex justify-between items-center space-x-1">
        <Input
          onChange={onChangeInput}
          placeholder="Nome da coluna"
          value={localTitle}
          className={cn(
            "text-zinc-100 placeholder:text-zinc-100 placeholder:font-md  w-full text-lg font-bold ring-0! border-0! outline-0!  p-0! rounded-md h-7",
          )}
          maxLength={42}
          minLength={1}
        ></Input>
        <span className="opacity-60 text-sm">{taskCount}</span>
        <button
          onClick={softDeleteColumn}
          className={cn(
            "cursor-pointer hover:text-red-400 duration-200 transition-all",
            taskCount != 0 && "opacity-0 size-0!",
          )}
        >
          <Trash className="size-4 " />
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-2 ">
        {tasks.map((task, index) => (
          <TaskItem
            index={index}
            columnId={id}
            action={taskAction}
            key={task.id}
            assignee={task.assignee}
            commentsCount={task.commentsCount !== 0 ? task.commentsCount : null}
            description={task.description}
            dueDate={task.dueDate}
            id={task.id}
            priority={task.priority}
            title={task.title}
          />
        ))}
      </div>
      <div className="flex justify-center flex-col  items-center mt-4 w-full">
        <NewTask
          columnId={id}
          projectId={projectId}
          isOpen={showNewTask}
          onClose={() => setShowNewTask(false)}
          onSave={createTask.mutate}
        />

        {!showNewTask && (
          <button
            onClick={addNewTask}
            className="flex items-center justify-center gap-1 py-2 border-2 border-dashed w-full rounded-full  border-zinc-200/20  opacity-80 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Adicionar tarefa</span>
          </button>
        )}
      </div>
    </div>
  );
});
