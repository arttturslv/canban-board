/** @format */
import { Controller, type Control } from "react-hook-form";

import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ptBR } from "date-fns/locale";
import type { taskForm } from "@/db/schemas";

interface DatePickerProps {
  control: Control<taskForm, any, taskForm>;
  controlName: keyof taskForm;
}

export function DatePicker({ control, controlName }: DatePickerProps) {
  return (
    <Controller
      name={controlName}
      control={control}
      render={({ field }) => {
        return (
          <Popover>
            <PopoverTrigger
              type="button"
              className=" inline-flex h-9  max-w-42 w-72 shrink-0 items-center  justify-between rounded-xl bg-[#2C2828] px-3 py-2 text-sm "
              data-empty={!field.value}
            >
              <span className="w-full text-start">
                {field.value ? (
                  format(new Date(field.value), "P", { locale: ptBR })
                ) : (
                  <span>Escolha uma data</span>
                )}
              </span>
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                locale={ptBR}
                lang="ptBR"
                mode="single"
                className="bg-[#2C2828]! rounded-3xl text-zinc-200"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => field.onChange(date?.toISOString())}
                defaultMonth={field.value ? new Date(field.value) : undefined}
              />
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
}
