/** @format */

import { Plus } from "lucide-react";
import TaskItem from "./Task-item";
import { mockTasks } from "../../db/mock-data";

interface ColumnProps {
  id: string;
  title: string;
}
export default function Column({ id, title }: ColumnProps) {
  const tasks = mockTasks;

  const addNewTask = () => {
    console.log("New task added in collumn with ID:", id);
  };

  const getTaskCount = (ColumnId: string) => {
    return tasks.filter((task) => task.columnId === ColumnId).length;
  };

  return (
    <div className="max-w-100 bg-[#3E3D44] p-4 rounded-3xl h-min">
      {/* header  */}
      <div className="flex justify-between items-center ">
        <h3 className="text-lg font-medium opacity-90">{title}</h3>
        <span className="opacity-60 text-sm">{getTaskCount(id)}</span>
      </div>
      {/* tasks  */}
      <div className="flex flex-col gap-2 mt-2">
        {tasks
          .filter((task) => task.columnId === id)
          .map((task) => (
            <TaskItem
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
      {/* footer  */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={addNewTask}
          className="flex items-center justify-center gap-1 py-2  opacity-80 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        >
          <Plus className="size-4" />
          <span>Adicionar tarefa</span>
        </button>
      </div>
    </div>
  );
}
