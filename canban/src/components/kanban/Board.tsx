/** @format */

import { useEffect, useMemo, useRef, useState } from "react";
import EditTaskSheet from "./Edit-task-sheet";
import { KanbanHeader } from "./header";
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

function flattenGrouped(
  grouped: Record<string, TaskResponse[]>,
): TaskResponse[] {
  return Object.entries(grouped).flatMap(([colId, tasks]) =>
    tasks.map((task, idx) => ({
      ...task,
      columnId: colId,
      order: idx * 100,
    })),
  );
}

export default function KanbanBoard({ projectId }: { projectId: string }) {
  const { tasks, columns, updateTaskBatch } = useKanban(projectId);
  const { createColumn } = useColumnMutation();
  const [localTasks, setLocalTasks] = useState<TaskResponse[]>(tasks);
  const isDragging = useRef(false);

  const dragGroupedStateRef = useRef<Record<string, TaskResponse[]> | null>(
    null,
  );

  const [dragTick, setDragTick] = useState(0);

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
    const grouped =
      isDragging.current && dragGroupedStateRef.current
        ? dragGroupedStateRef.current
        : buildGroupedTasks(localTasks, columns);

    return filter(columns, (col) => col.visibility)
      .sort((a, b) => a.order - b.order)
      .map((col) => ({
        ...col,
        tasks: (grouped[col.id] ?? []).map((task, idx) => ({
          ...task,
          order: idx * 100,
        })),
      }));
  }, [columns, localTasks, dragTick]);

  const [activeId, setActiveId] = useState<string | null>(null);

  const activeTask = localTasks.find((t) => t.id === activeId);

  const onDragStart = (event: any) => {
    isDragging.current = true;
    dragGroupedStateRef.current = buildGroupedTasks(localTasks, columns);
    setActiveId(event.operation.source.id);
  };

  const onDragOver = (event: any) => {
    const { source, target } = event.operation;
    if (!source || !target || !dragGroupedStateRef.current) return;

    const newGroupedState = move(dragGroupedStateRef.current, event) as Record<
      string,
      TaskResponse[]
    >;

    if (!newGroupedState) return;

    dragGroupedStateRef.current = newGroupedState;

    setDragTick((t) => t + 1);
  };

  const onDragEnd = (event: any) => {
    isDragging.current = false;
    setActiveId(null);

    if (event.canceled || !dragGroupedStateRef.current) {
      dragGroupedStateRef.current = null;
      setLocalTasks(tasks);
      return;
    }

    const finalTasks = flattenGrouped(dragGroupedStateRef.current);
    dragGroupedStateRef.current = null;

    const dbTaskMap = new Map(tasks.map((t) => [t.id, t]));
    const batchUpdates: {
      id: string;
      updates: { order: number; columnId: string };
    }[] = [];

    finalTasks.forEach((finalTask) => {
      const dbTask = dbTaskMap.get(finalTask.id);
      if (
        !dbTask ||
        dbTask.columnId !== finalTask.columnId ||
        dbTask.order !== finalTask.order
      ) {
        batchUpdates.push({
          id: finalTask.id,
          updates: {
            columnId: finalTask.columnId,
            order: finalTask.order,
          },
        });
      }
    });

    setLocalTasks(finalTasks);

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
