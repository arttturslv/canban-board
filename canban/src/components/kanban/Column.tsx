/** @format */

import { Plus } from "lucide-react";
import TaskItem from "./task-item";

export default function Collumn() {
  const addNewTask = () => {
    console.log("New task added");
  };

  return (
    <div className="max-w-100 bg-[#3E3D44] p-4 rounded-3xl ">
      {/* header  */}
      <div className="flex justify-between items-center ">
        <h3 className="text-lg font-medium opacity-90">To Do</h3>
        <span className="opacity-60 text-sm">5</span>
      </div>
      {/* tasks  */}
      <div className="flex flex-col gap-4 mt-2">
        <TaskItem />
        <TaskItem />
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
