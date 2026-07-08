/** @format */
import { Calendar, MessageCircle, User } from "lucide-react";

export default function TaskItem() {
  return (
    <div className="flex gap-4 justify-between  items-stretch bg-[#211E21] py-2.5 pr-2 rounded-2xl">
      <div className="bg-red-300 flex grow w-2.5 ml-2 my-1.5 rounded-full"></div>
      <div className="flex flex-col gap-1">
        <span className="text-start">
          <p className="font-medium tracking-wider">Generate A2 blog draft</p>
          <p className="font-light opacity-90 leading-tight">
            Full blog with AI images, AI text, Ai analysis and a lot more of AI
            features.
          </p>
        </span>
        <span className="font-light opacity-90 text-sm space-y-1">
          <p className="flex gap-1 items-center ">
            <User className="size-4" /> Artur Marcosa
          </p>
          <p className="flex gap-1 items-center">
            <Calendar className="size-4" /> 07/07/2025
          </p>
          <span className="flex gap-2">
            <p className="flex gap-1 items-center">
              <MessageCircle className="size-4" /> 8
            </p>
          </span>
        </span>
      </div>
    </div>
  );
}
