/** @format */

import { Settings2 } from "lucide-react";

export const KanbanHeader = () => {
  const openFilterSheet = () => {
    console.log("Filter sheet opened");
  };

  return (
    <div className="flex flex-col justify-between items-center px-10 ">
      <div className="flex justify-between items-center py-2 w-full">
        <span>
          <h2 className="text-lg font-medium opacity-90">Kanban Board</h2>
        </span>
        <button
          onClick={openFilterSheet}
          className="flex gap-1 items-center opacity-80 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        >
          <Settings2 className="size-4" />
          <p>Filtro</p>
        </button>
      </div>

      <span className="bg-white h-px w-full opacity-40" />
    </div>
  );
};
