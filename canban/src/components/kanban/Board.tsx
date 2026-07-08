/** @format */

import Collumn from "./column";
import { KanbanHeader } from "./header";

export default function KanbanBoard() {
  return (
    <div className="flex flex-col w-full h-full gap-3 px-12 ">
      <KanbanHeader />
      <div>
        <Collumn></Collumn>
      </div>
    </div>
  );
}
