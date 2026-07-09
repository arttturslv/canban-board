/** @format */

import { useMemo, useState } from "react";
import Collumn from "./Column";
import EditTaskSheet from "./Edit-task-sheet";
import { KanbanHeader } from "./Header";
import { mockColumns } from "../../db/mock-data";
import { map, groupBy } from "lodash";
import { useKanban } from "../../hooks/use-kanban";

export default function KanbanBoard() {
  const { tasks } = useKanban();
  const columns = mockColumns;

  const [sheetOpen, setIsSheetOpen] = useState<null | string>(null);

  const openTask = (taskId: string) => {
    console.log("Opening: ", taskId);
    setIsSheetOpen(taskId);
  };

  const closeEditTaskSheet = () => {
    setIsSheetOpen(null);
  };

  const board = useMemo(() => {
    const tasksByCollumn = groupBy(tasks, (item) => item.columnId);

    return columns
      .filter((col) => col.visibility)
      .sort((a, b) => a.order - b.order)
      .map((col) => ({
        ...col,
        tasks: tasksByCollumn[col.id] ?? [],
      }));
  }, [columns, tasks]);

  return (
    <div className="flex flex-col  h-full gap-6 px-12 ">
      <KanbanHeader />
      <div className="flex gap-4 h-full overflow-x-auto w-full">
        {map(board, (col) => {
          return (
            <Collumn
              taskAction={openTask}
              id={col.id}
              tasks={col.tasks}
              title={col.name}
            ></Collumn>
          );
        })}
      </div>
      <EditTaskSheet
        open={!!sheetOpen}
        taskId={sheetOpen}
        onClose={closeEditTaskSheet}
      />
    </div>
  );
}
