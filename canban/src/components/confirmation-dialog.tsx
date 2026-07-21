/** @format */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import type { JSXElementConstructor, ReactElement } from "react";
import type {
  ComponentRenderFn,
  DialogTriggerState,
  HTMLProps,
} from "@base-ui/react";

interface ConfirmationModalProps {
  title: string;
  description: string;
  action: () => void;
  children:
    | ReactElement<unknown, string | JSXElementConstructor<any>>
    | ComponentRenderFn<HTMLProps, DialogTriggerState>
    | undefined;
}
export function ConfirmationModal({
  action,
  description,
  title,
  children,
}: ConfirmationModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className={"ring-0! border-0!"} render={children} />
      <AlertDialogOverlay className="backdrop-blur-sm bg-black/50" />
      <AlertDialogContent
        className={
          "bg-[#252323] flex flex-col gap-3 pb-4 text-white border-0! ring-0!"
        }
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={"border-0! font-normal  cursor-pointer"}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className={" font-normal text-red-400 cursor-pointer"}
            onClick={action}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
