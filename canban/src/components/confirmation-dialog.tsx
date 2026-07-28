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
      <AlertDialogOverlay className="backdrop-blur-sm bg-[black/50]" />
      <AlertDialogContent
        className={
          "bg-[#211E21] flex flex-col gap-3 pb-5 text-white border-0! ring-0!"
        }
      >
        <AlertDialogHeader className="gap-1 mb-4">
          <AlertDialogTitle className="text-md font-medium">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="font-light">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full ">
          <AlertDialogAction
            className={
              " font-normal text-red-200 bg-[#AE3636]/40 h-10 grow hover:bg-[#AE3636]/60 cursor-pointer"
            }
            onClick={action}
          >
            Confirmar
          </AlertDialogAction>
          <AlertDialogCancel
            variant={"default"}
            className={
              " font-normal text-white bg-zinc-500/20 hover:bg-zinc-500/40 h-10  px-8  cursor-pointer border-0"
            }
          >
            Cancelar
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
