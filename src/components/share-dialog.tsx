/** @format */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/use-auth-store";
import { useForm, type SubmitHandler } from "react-hook-form";
import ComboboxSelection from "./combobox-selection";
import { Loader2, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { useState } from "react";
import { useProjectMemberMutation } from "@/hooks/use-project-member-mutation";
import { map } from "lodash";

interface shareForm {
  email: string;
  role?: "editor" | "viewer";
  avatarFile?: FileList;
}

export function ShareModal({
  projectId,
  onClose,
  show,
}: {
  projectId: string;
  onClose: () => void;
  show: boolean;
}) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { useProjectMembers, addMemberByEmail } =
    useProjectMemberMutation(projectId);
  const { data: projectMembers } = useProjectMembers();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<shareForm>({
    values: {
      email: "",
      role: "viewer",
    },
  });

  const onSubmit: SubmitHandler<shareForm> = async (data) => {
    if (!user) return;

    setLoading(true);

    try {
      await addMemberByEmail.mutateAsync({
        email: data.email,
        role: data.role,
      });
      toast.success("Usuário adicionado com sucesso!");
      reset();
    } catch (err: any) {
      toast.error(err.message || "Erro ao adicionar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="w-[50vw]! max-w-none! bg-[#211E21] ring-0 text-white gap-3">
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-md font-medium">
              Compartilhar{" "}
            </DialogTitle>
            <DialogDescription className="font-light">
              Compartilhe este projeto com outros usuários, permitindo que eles
              visualizem ou editem o conteúdo.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="gap-3 mt-4 flex flex-row">
            <Field className="gap-2">
              <Input
                className="bg-[#2C2828] ring-0! outline-0! border-0! rounded-xl h-9 font-light"
                required
                placeholder="e-mail do usuário"
                {...register("email", {
                  required: "O email é obrigatório",
                })}
              />
              {errors.email && (
                <span className="text-xs text-red-400">
                  {errors.email.message}
                </span>
              )}
            </Field>

            <Field className="gap-2 h-full w-78">
              <ComboboxSelection
                array={["editor", "viewer"]}
                controlName="role"
                control={control}
                type="constrast"
              />
            </Field>

            <button
              className={
                " font-normal  text-red-200 bg-[#3D6A3F] rounded-lg h-9 w-16 flex items-center justify-center hover:contrast-125 cursor-pointer"
              }
              type="submit"
            >
              {loading ? (
                <Loader2 className="size-3.5" />
              ) : (
                <Send className="size-3.5" />
              )}
            </button>
          </FieldGroup>
        </form>
        <div className="flex flex-col gap-2">
          {map(projectMembers, (item) => {
            return (
              <span
                key={item.id}
                className=" flex gap-3 items-center text-white/80"
              >
                <Avatar>
                  <AvatarImage src={item?.user.avatarUrl || undefined} />
                  <AvatarFallback className="bg-black/20">
                    {item?.user?.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="flex flex-col ">
                  <span className="font-medium flex gap-1 items-center ">
                    {item?.user.name || item?.user?.email?.split("@")[0]}
                    {item.userId === user?.id && (
                      <span className="opacity-40 text-xs">(você)</span>
                    )}
                  </span>
                  <span className="text-xs">{item?.user?.email}</span>
                </span>
              </span>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
