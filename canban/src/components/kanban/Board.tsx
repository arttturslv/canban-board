/** @format */

import { useState } from "react";
import Collumn from "./Column";
import EditTaskSheet from "./Edit-task-sheet";
import { KanbanHeader } from "./Header";

export default function KanbanBoard() {
  const [sheetOpen, setIsSheetOpen] = useState<null | string>(null);

  const openTask = (taskId: string) => {
    console.log("Opening: ", taskId);
    setIsSheetOpen(taskId);
  };

  const closeEditTaskSheet = () => {
    setIsSheetOpen(null);
  };

  return (
    <div className="flex flex-col  h-full gap-6 px-12 ">
      <KanbanHeader />
      <div className="flex gap-4 h-full overflow-x-auto">
        <Collumn taskAction={openTask} id="todo" title="To Do"></Collumn>
        <Collumn
          taskAction={openTask}
          id="in-progress"
          title="In Progress"
        ></Collumn>
        <Collumn taskAction={openTask} id="done" title="Done"></Collumn>
      </div>
      <EditTaskSheet
        open={!!sheetOpen}
        taskId={sheetOpen}
        onClose={closeEditTaskSheet}
      />
    </div>
  );
}
