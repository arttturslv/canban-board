/** @format */
import { Controller, type Control } from "react-hook-form";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import type { taskForm } from "./kanban/Edit-task-sheet";

interface ComboboxSelectionProps {
  control: Control<taskForm>;
  controlName: keyof taskForm;
  array: string[];
}
export default function ComboboxSelection({
  control,
  controlName,
  array,
}: ComboboxSelectionProps) {
  return (
    <Controller
      name={controlName}
      control={control}
      render={({ field }) => (
        <Combobox
          value={field.value}
          onValueChange={(val) => field.onChange(val)}
          items={array}
        >
          <div className="flex items-center ">
            <ComboboxInput
              className={"px-0! mx-0! ring-0! w-full rounded-xl bg-[#2C2828] "}
              placeholder="Selecione"
              ref={field.ref}
            />
            <ComboboxContent className={"px-0!  mx-0! bg-[#161416] ring-0! "}>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
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
        </Combobox>
      )}
    ></Controller>
  );
}
