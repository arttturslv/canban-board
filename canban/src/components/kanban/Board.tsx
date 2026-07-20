/** @format */

import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import EditTaskSheet from "./Edit-task-sheet";
import { KanbanHeader } from "./Header";
import { map, groupBy } from "lodash";
import { useKanban } from "../../hooks/use-board";
import { DragDropProvider, DragOverlay } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { isSortable } from "@dnd-kit/react/sortable";
import { TaskItem } from "./Task-item";
import type { Column as ColumnType, TaskResponse } from "@/db/schemas";
import { Column } from "./Column";

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

function buildBatchUpdates(
  groupedState: Record<string, TaskResponse[]>,
  affectedColumns: Set<string>,
) {
  const batchUpdates: {
    id: string;
    updates: { order: number; columnId: string };
  }[] = [];

  for (const columnId of affectedColumns) {
    const columnTasks = groupedState[columnId] ?? [];

    columnTasks.forEach((task, index) => {
      const newOrder = index * 100;

      if (task.columnId !== columnId || task.order !== newOrder) {
        batchUpdates.push({
          id: task.id,
          updates: {
            columnId,
            order: newOrder,
          },
        });
      }
    });
  }

  return batchUpdates;
}

function applyBatchUpdates(
  tasks: TaskResponse[],
  batchUpdates: { id: string; updates: { order: number; columnId: string } }[],
) {
  const updatesMap = new Map(
    batchUpdates.map((item) => [item.id, item.updates]),
  );

  return tasks.map((task) =>
    updatesMap.has(task.id) ? { ...task, ...updatesMap.get(task.id) } : task,
  );
}

export default function KanbanBoard({ projectId }: { projectId: string }) {
  const { tasks, columns, updateTaskBatch } = useKanban(projectId);

  const [localTasks, setLocalTasks] = useState<TaskResponse[]>(tasks);
  const isDragging = useRef(false);
  const sourceParentRef = useRef<HTMLElement | null>(null);

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

    return columns
      .filter((col) => col.visibility)
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
    sourceParentRef.current =
      event.operation.source?.element?.parentElement ?? null;
    setActiveId(event.operation.source.id);
  };

  const onDragOver = (event: any) => {
    event.preventDefault();
  };

  const onDragEnd = (event: any) => {
    isDragging.current = false;
    setActiveId(null);

    const sourceElement = event.operation.source?.element as
      HTMLElement | undefined;
    const previousParent = sourceParentRef.current;
    sourceParentRef.current = null;

    if (
      sourceElement &&
      previousParent &&
      sourceElement.parentElement !== previousParent
    ) {
      previousParent.appendChild(sourceElement);
    }

    if (event.canceled) {
      setLocalTasks(tasks);
      return;
    }

    const { source, target } = event.operation;

    if (!target) return;

    if (!isSortable(source)) return;

    const oldIndex = source.sortable.initialIndex;
    const newIndex = source.sortable.index;
    const sourceColumnId = (source.sortable.initialGroup ??
      source.group) as string;
    const targetColumnId = isSortable(target)
      ? ((target.sortable.group ?? target.group) as string)
      : (target.id as string);

    if (oldIndex === newIndex && sourceColumnId === targetColumnId) {
      return;
    }

    const groupedTasks = buildGroupedTasks(localTasks, columns);
    const newGroupedState = move(groupedTasks, event) as Record<
      string,
      TaskResponse[]
    >;
    const affectedColumns = new Set([sourceColumnId, targetColumnId]);
    const batchUpdates = buildBatchUpdates(newGroupedState, affectedColumns);

    if (batchUpdates.length === 0) return;

    flushSync(() => {
      setLocalTasks((currentTasks) =>
        applyBatchUpdates(currentTasks, batchUpdates),
      );
    });

    updateTaskBatch.mutate(batchUpdates);
  };

  return (
    <div className="flex flex-col  h-full gap-6 px-12 ">
      <KanbanHeader projectId={projectId} />
      <div className="flex gap-4 h-full overflow-x-auto w-full mb-4">
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
                  action={() => console.log("aa")}
                  mock={true}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DragDropProvider>
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
