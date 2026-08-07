/** @format */
import { Calendar, MessageCircle, User } from "lucide-react";
import { cn, getPriorityColor } from "@/lib/utils";
import { memo } from "react";
import { useSortable } from "@dnd-kit/react/sortable";

interface TaskItemProps {
  id: string;
  index: number;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string | null;
  due_date: string | null;
  commentsCount: number | null;
  column_id: string;
  action: (taskId: string) => void;
  mock?: boolean;
}

export const TaskItem = memo(function TaskItem({
  id,
  title,
  index,
  action,
  description,
  priority,
  assignee,
  due_date,
  commentsCount,
  column_id,
  mock,
}: TaskItemProps) {
  let priorityColor = getPriorityColor(priority);
  const isUrgent = priority === "urgent";

  const { ref, isDragging } = mock
    ? { ref: null }
    : useSortable({
        id: id,
        index,
        type: "task",
        group: column_id,
        accept: "task",
      });

  return (
    <div
      ref={mock ? null : ref}
      onClick={() => action(id)}
      className={cn(
        "flex gap-3 justify-between  items-stretch  py-3 pr-2 cursor-pointer hover:opacity-90 transition-all duration-200 bg-[#201820]  rounded-2xl border-2 border-[#413441]",
        isUrgent && "bg-linear-to-br from-[#120303] to-[#211E21]",
        isDragging && "opacity-0",
      )}
    >
      <div
        className={`flex shrink-0 max-w-1.5 w-full ml-2  rounded-full ${priorityColor}`}
      ></div>
      <div className="flex flex-col w-full gap-1.5">
        <span className="text-start space-y-1">
          <p
            className={cn("font-medium leading-4", isUrgent && "text-red-500")}
          >
            {title}
          </p>
          {description && (
            <p className="font-light text-sm opacity-90 leading-tight text-ellipsis line-clamp-2">
              {description}
            </p>
          )}
        </span>
        <span className="font-light opacity-90 text-xs space-y-1">
          <span className="flex gap-2">
            {assignee && (
              <p className="flex gap-0.5 items-center ">
                <User className="size-3" /> {assignee}
              </p>
            )}

            {commentsCount && (
              <p className="flex gap-0.5 items-center ">
                <MessageCircle className="size-3" /> {1}
              </p>
            )}
          </span>

          {due_date && (
            <p className="flex gap-1 items-center">
              <Calendar className="size-3" />{" "}
              {new Date(due_date).toLocaleDateString("pt-BR")}
            </p>
          )}
        </span>
      </div>
    </div>
  );
});
