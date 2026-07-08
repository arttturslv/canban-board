/** @format */

import { Bell, EllipsisVertical, Share2 } from "lucide-react";

import KanbanBoard from "./components/kanban/Board";

function App() {
  return (
    <div className="bg-[#211E21] text-white w-full h-screen">
      <PageHeader />
      <KanbanBoard />
    </div>
  );
}

export default App;

export const PageHeader = () => {
  const openShareModal = () => {
    console.log("Share modal opened");
  };

  const openLogSheet = () => {
    console.log("Log sheet opened");
  };

  const openSettingsSheet = () => {
    console.log("Settings sheet opened");
  };

  return (
    <div className="flex justify-between items-center px-10 py-6">
      <div>
        <h1 className="text-xl font-bold text-white ">🫶 Life Goals</h1>
      </div>
      <div className="flex gap-4">
        <button
          onClick={openShareModal}
          className="p-1 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
        >
          <Share2 className="size-4" />
        </button>

        <button
          onClick={openLogSheet}
          className="p-1 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
        >
          <Bell className="size-4" />
        </button>

        <button
          onClick={openSettingsSheet}
          className="p-1 hover:opacity-80 transition-opacity duration-200 cursor-pointer"
        >
          <EllipsisVertical className="size-4" />
        </button>
      </div>
    </div>
  );
};
