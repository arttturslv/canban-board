/** @format */

import { useEffect, useMemo, useRef, useState } from "react";
import EditTaskSheet from "./Edit-task-sheet";
import { KanbanHeader } from "./Header";
import { map, groupBy, filter } from "lodash";
import { useKanban } from "../../hooks/use-board";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { TaskItem } from "./Task-item";
import type { Column as ColumnType, TaskResponse } from "@/db/schemas";
import { Column } from "./Column";
import { Plus } from "lucide-react";
import { useColumnMutation } from "@/hooks/use-column-mutation";

function buildGroupedTasks(tasks: TaskResponse[], columns: ColumnType[]) {
  const tasksByColumn = groupBy(tasks, (task) => task.columnId);

  return Object.fromEntries(
    columns
      .filter((col) => col.visibility)
      .map((col) => [
        col.id,
        [...(tasksByColumn[col.id] ?? [])].sort((a, b) => a.order - b.order),
      ]),
  );
}

export default function KanbanBoard({ projectId }: { projectId: string }) {
  const { tasks, columns, updateTaskBatch } = useKanban(projectId);
  const { createColumn } = useColumnMutation();
  const [localTasks, setLocalTasks] = useState<TaskResponse[]>(tasks);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!isDragging.current) {
      setLocalTasks(tasks);
    }
  }, [tasks]);

  const [sheetOpen, setIsSheetOpen] = useState<null | string>(null);

  const openTask = (taskId: string) => {
    setIsSheetOpen(taskId);
  };

  const closeEditTaskSheet = () => {
    setIsSheetOpen(null);
  };

  const board = useMemo(() => {
    const tasksByCollumn = groupBy(localTasks, (item) => item.columnId);

    return filter(columns, (col) => col.visibility)
      .sort((a, b) => a.order - b.order)
      .map((col) => ({
        ...col,
        tasks: (tasksByCollumn[col.id] ?? []).sort((a, b) => a.order - b.order),
      }));
  }, [columns, localTasks]);

  const [activeId, setActiveId] = useState<string | null>(null);

  const activeTask = localTasks.find((t) => t.id === activeId);

  const onDragStart = (event: any) => {
    isDragging.current = true;
    setActiveId(event.operation.source.id);
  };

  const onDragOver = (event: any) => {
    const { source, target } = event.operation;
    if (!source || !target) return;

    const groupedTasks = buildGroupedTasks(localTasks, columns);
    const newGroupedState = move(groupedTasks, event) as Record<
      string,
      TaskResponse[]
    >;

    if (!newGroupedState) return;

    const updatedTasks: TaskResponse[] = [];
    for (const colId of Object.keys(newGroupedState)) {
      const colTasks = newGroupedState[colId] ?? [];
      colTasks.forEach((task, idx) => {
        updatedTasks.push({
          ...task,
          columnId: colId,
          order: idx * 100,
        });
      });
    }

    setLocalTasks(updatedTasks);
  };

  const onDragEnd = (event: any) => {
    isDragging.current = false;
    setActiveId(null);

    if (event.canceled) {
      setLocalTasks(tasks);
      return;
    }

    const dbTaskMap = new Map(tasks.map((t) => [t.id, t]));
    const batchUpdates: {
      id: string;
      updates: { order: number; columnId: string };
    }[] = [];

    localTasks.forEach((localTask) => {
      const dbTask = dbTaskMap.get(localTask.id);
      if (
        !dbTask ||
        dbTask.columnId !== localTask.columnId ||
        dbTask.order !== localTask.order
      ) {
        batchUpdates.push({
          id: localTask.id,
          updates: {
            columnId: localTask.columnId,
            order: localTask.order,
          },
        });
      }
    });

    if (batchUpdates.length > 0) {
      updateTaskBatch.mutate(batchUpdates);
    }
  };

  return (
    <div className="flex flex-col  h-full gap-6 min:px-12 px-4">
      <KanbanHeader projectId={projectId} />
      <div className="flex gap-4 h-full overflow-x-auto w-full mb-4 custom-scroll">
        <DragDropProvider
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          {map(board, (col) => {
            return (
              <Column
                projectId={projectId}

                key={col.id}
                taskAction={openTask}
                id={col.id}
                tasks={col.tasks}
                title={col.title}
              ></Column>
            );
          })}
          <DragOverlay>
            {activeTask ? (
              <div className="transform rotate-2 scale-105 pointer-events-none">
                <TaskItem
                  key={"mockTask"}
                  title={activeTask.title}
                  priority={activeTask.priority}
                  id={activeTask.id}
                  index={activeTask.order}
                  description={activeTask.description}
                  assignee={activeTask.assignee}
                  dueDate={activeTask.dueDate}
                  commentsCount={activeTask.commentsCount}
                  columnId={activeTask.columnId}
                  action={() => console.log("")}
                  mock={true}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DragDropProvider>
        <button
          onClick={() =>
            createColumn.mutate({ column: { projectId, title: "Nova coluna" } })
          }
          className="flex items-center shrink-0 max-h-12 sm:max-w-[25vw] justify-center gap-1 py-2 border-2 border-dashed w-full rounded-full  border-zinc-200/20  opacity-80 hover:opacity-100 transition-opacity duration-200 cursor-pointer max-sm:w-64"
        >
          <Plus className="size-4" />
          <span>Adicionar coluna</span>
        </button>
      </div>
      <EditTaskSheet
        projectId={projectId}
        open={!!sheetOpen}
        taskId={sheetOpen}
        onClose={closeEditTaskSheet}
      />
    </div>
  );
}
