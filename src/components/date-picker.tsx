/** @format */
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ptBR } from "date-fns/locale";

interface DatePickerProps<T extends FieldValues> {
  control: Control<T, any, T>;
  controlName: Path<T>;
}

export function DatePicker<T extends FieldValues>({
  control,
  controlName,
}: DatePickerProps<T>) {
  return (
    <Controller
      name={controlName}
      control={control}
      render={({ field }) => {
        return (
          <Popover>
            <PopoverTrigger
              type="button"
              className=" inline-flex h-full  w-72 shrink-0 items-center  justify-between rounded-xl bg-[#2C2828] px-3 py-2 text-sm "
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

            <PopoverContent className="w-auto p-0  bg-[#201820] " align="start">
              <Calendar
                captionLayout="dropdown"
                locale={ptBR}
                lang="ptBR"
                mode="single"
                className=" rounded-3xl   text-zinc-200 border-2 border-[#413441]"
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
