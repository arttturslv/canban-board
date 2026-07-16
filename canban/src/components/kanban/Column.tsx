/** @format */

import { Plus } from "lucide-react";
import { TaskItem } from "./Task-item";
import NewTask from "./New-task";
import type { TaskResponse } from "../../db/schema";
import { memo, useState } from "react";
import { useKanban } from "../../hooks/use-kanban";
import { cn } from "../../lib/utils";
import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
interface ColumnProps {
  id: string;
  title: string;
  taskAction: (taskId: string) => void;
  tasks: TaskResponse[];
}
export const Column = memo(function Column({
  id,
  title,
  taskAction,
  tasks,
}: ColumnProps) {
  const { createTask } = useKanban();
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

  return (
    <div
      ref={ref}
      className={cn(
        "max-w-100 w-full bg-[#3E3D44] p-4 rounded-3xl h-full transition-all duration-200",
        isDropTarget && "bg-red-400",
      )}
    >
      <div className="flex justify-between items-center ">
        <h3 className="text-lg font-medium opacity-90">{title}</h3>
        <span className="opacity-60 text-sm">{taskCount}</span>
      </div>
      <div className="flex flex-col gap-2 mt-2 min-h-8">
        {tasks.map((task, index) => (
          <TaskItem
            index={index}
            columnId={id}
            action={taskAction}
            order={task.order}
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
          projectId="main"
          isOpen={showNewTask}
          onClose={() => setShowNewTask(false)}
          onSave={createTask}
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
