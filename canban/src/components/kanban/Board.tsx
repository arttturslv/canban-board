/** @format */

import Collumn from "./Column";
import { KanbanHeader } from "./Header";

export default function KanbanBoard() {
  return (
    <div className="flex flex-col  h-full gap-6 px-12 ">
      <KanbanHeader />
      <div className="flex gap-4 h-full overflow-x-auto">
        <Collumn id="todo" title="To Do"></Collumn>
        <Collumn id="in-progress" title="In Progress"></Collumn>
        <Collumn id="done" title="Done"></Collumn>
      </div>
    </div>
  );
}
