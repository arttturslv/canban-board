/** @format */

import { Plus } from "lucide-react";
import TaskItem from "./Task-item";
import NewTask from "./New-task";
import type { TaskResponse } from "../../db/schema";
import { useState } from "react";
import { useKanban } from "../../hooks/use-kanban";

interface ColumnProps {
  id: string;
  title: string;
  taskAction: (taskId: string) => void;
  tasks: TaskResponse[];
}
export default function Column({ id, title, taskAction, tasks }: ColumnProps) {
  const { createTask } = useKanban();
  const [showNewTask, setShowNewTask] = useState(false);

  const addNewTask = () => {
    setShowNewTask(true);
  };

  const taskCount = tasks.length;

  return (
    <div className="max-w-100 w-full bg-[#3E3D44] p-4 rounded-3xl h-min">
      <div className="flex justify-between items-center ">
        <h3 className="text-lg font-medium opacity-90">{title}</h3>
        <span className="opacity-60 text-sm">{taskCount}</span>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {tasks
          .filter((task) => task.columnId === id)
          .map((task) => (
            <TaskItem
              action={taskAction}
              key={task.id}
              assignee={task.assignee}
              commentsCount={
                task.commentsCount !== 0 ? task.commentsCount : null
              }
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
            className="flex items-center justify-center gap-1 py-2 border-[2px] border-dashed w-full rounded-full  border-zinc-200/20  opacity-80 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          >
            <Plus className="size-4" />
            <span>Adicionar tarefa</span>
          </button>
        )}
      </div>
    </div>
  );
}
