/** @format */

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import type React from "react";
import { cn } from "@/lib/utils";

interface ComboboxSelectionProps<T extends FieldValues> {
  control: Control<T>;
  controlName: Path<T>;
  array: string[];
  icon?: React.ReactNode;
  type?: "constrast";
  isMulti?: boolean;
}

export default function ComboboxSelection<T extends FieldValues>({
  control,
  controlName,
  array,
  icon,
  type,
  isMulti = false,
}: ComboboxSelectionProps<T>) {
  return (
    <Controller
      name={controlName}
      control={control}
      render={({ field }) => {
        const content = (
          <div className="flex items-center w-full">
            <div className={cn(!!icon && "flex items-center", "w-full")}>
              {icon}
              <ComboboxInput
                className={cn(
                  "px-0! mx-0! ring-0! w-full rounded-xl bg-transparent",
                  type === "constrast" && "bg-[#2C2828]",
                )}
                value={field.value}
                placeholder="Selecione"
                ref={field.ref}
              />
            </div>
            <ComboboxContent className={"px-0! mx-0! bg-[#201820] ring-0!"}>
              <ComboboxEmpty className="bg-[#201820] text-white">
                Nenhum item encontrado.
              </ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem
                    className={"text-white font-normal"}
                    key={item}
                    value={item}
                  >
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </div>
        );

        if (isMulti) {
          return (
            <Combobox
              multiple={true}
              value={(field.value as string[]) ?? []}
              onValueChange={(val) => field.onChange(val)}
              items={array}
            >
              {content}
            </Combobox>
          );
        }

        return (
          <Combobox
            multiple={false}
            value={(field.value as string) ?? ""}
            onValueChange={(val) => field.onChange(val)}
            items={array}
          >
            {content}
          </Combobox>
        );
      }}
    />
  );
}
