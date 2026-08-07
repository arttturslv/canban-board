/** @format */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfileUpdate, ProfileUser } from "@/db/schemas";
import { useAuthStore } from "@/store/use-auth-store";
import {
  type JSXElementConstructor,
  type ReactElement,
  useMemo,
  useState,
} from "react";
import { DatePicker } from "./date-picker";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { Upload } from "lucide-react";
import type {
  ComponentRenderFn,
  DialogTriggerState,
  HTMLProps,
} from "@base-ui/react";
import { Switch } from "./ui/switch";
import { StorageService } from "@/db/services/storage.service";
import { AuthService } from "@/db/services/auth.service";
import { toast } from "sonner";

type ProfileModalForm = Omit<
  ProfileUser,
  "id" | "created_at" | "provider" | "updated_at"
> & {
  avatarFile?: FileList;
};

export function ProfileModal({
  children,
}: {
  children:
    | ReactElement<unknown, string | JSXElementConstructor<any>>
    | ComponentRenderFn<HTMLProps, DialogTriggerState>
    | undefined;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { user, profile, setProfile } = useAuthStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileModalForm>({
    values: {
      avatar_url: profile?.avatar_url || null,
      email: profile?.email || user?.email || "",
      name: profile?.name || "",
      born_date: profile?.born_date || null,
      system: {
        language: profile?.system?.language || "pt-BR",
        theme_dark: !!profile?.system?.theme_dark,
        notifications_enabled: !!profile?.system?.notifications_enabled,
      },
    },
  });

  const avatarFileList = watch("avatarFile");
  const avatarPreviewUrl = useMemo(() => {
    if (avatarFileList && avatarFileList.length > 0) {
      return URL.createObjectURL(avatarFileList[0]);
    }
    return profile?.avatar_url || null;
  }, [avatarFileList, profile?.avatar_url]);

  const onSubmit: SubmitHandler<ProfileModalForm> = async (data) => {
    if (!user) return;

    try {
      let avatar_url = profile?.avatar_url || null;
      const file = data.avatarFile?.[0];

      if (file) {
        const { publicUrl, error: uploadError } =
          await StorageService.compressAndStoreImage({
            bucket: "pictures",
            file,
            user_id: user.id,
          });

        if (uploadError || !publicUrl) {
          toast.error(
            `Falha ao enviar a foto de perfil: ${uploadError || "URL pública não gerada"}`,
          );
        }

        avatar_url = publicUrl || null;
      }

      const profileUpdate: ProfileUpdate = {
        name: data.name,
        avatar_url,
        born_date: data.born_date,
        theme_dark: !!data.system?.theme_dark,
        language: data.system?.language || ("pt-BR" as const),
        notifications_enabled: data.system?.notifications_enabled || false,
      };

      const { data: profileUser, error } = await AuthService.updateUser({
        user_id: user.id,
        profile: profileUpdate,
      });

      if (error && !profileUser) {
        console.error("Erro ao atualizar perfil:", error);
      } else {
        setProfile(profileUser);
        onSuccess();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onSuccess = () => {
    setOpen(false);
    toast.success("Perfil atualizado");
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={"ring-0! border-0!"} render={children} />
      <DialogOverlay className="backdrop-blur-sm bg-[black/50]" />

      <DialogContent className="sm:max-w-sm bg-[#211E21] ring-0 text-white">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-md font-medium">Perfil</DialogTitle>
            <DialogDescription className="font-light">
              Veja e altere as informações do seu perfil
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-3 mt-4">
            <Field className="gap-2 flex items-center justify-center w-full">
              <Label
                className="flex flex-col items-center justify-center gap-2 cursor-pointer group"
                htmlFor="avatar-upload"
              >
                <span className="size-24 rounded-full flex items-center justify-center bg-[#2C2828] overflow-hidden relative">
                  {avatarPreviewUrl ? (
                    <img
                      src={avatarPreviewUrl}
                      alt="Preview do avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="size-5 opacity-45 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                </span>
                <span className="text-xs text-zinc-400 group-hover:text-white transition-colors">
                  Alterar foto
                </span>
              </Label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/png, image/jpeg, .png, .jpg, .jpeg"
                className="hidden"
                {...register("avatarFile")}
              />
            </Field>

            <Field className="gap-2">
              <Label className="font-light text-sm" htmlFor="email">
                Email*
              </Label>
              <Input
                id="email"
                className="bg-[#2C2828] ring-0! outline-0! border-0! rounded-xl h-10 font-light opacity-60 cursor-not-allowed"
                disabled
                {...register("email")}
              />
              {errors.email && (
                <span className="text-xs text-red-400">
                  {errors.email.message}
                </span>
              )}
            </Field>

            <Field className="gap-2">
              <Label className="font-light text-sm" htmlFor="name">
                Nome*
              </Label>
              <Input
                id="name"
                className="bg-[#2C2828] ring-0! outline-0! border-0! rounded-xl h-10 font-light"
                {...register("name", {
                  required: "O nome é obrigatório",
                  minLength: {
                    value: 4,
                    message: "O nome deve ter no mínimo 4 caracteres",
                  },
                })}
              />
              {errors.name && (
                <span className="text-xs text-red-400">
                  {errors.name.message}
                </span>
              )}
            </Field>

            <Field className="gap-2">
              <Label className="font-light text-sm" htmlFor="born_date">
                Data de Nascimento
              </Label>
              <DatePicker control={control} controlName={"born_date"} />
            </Field>

            <Field className="flex flex-row items-center justify-between w-full opacity-30">
              <Label htmlFor="night-mode" className="font-light text-sm">
                Modo noturno
              </Label>
              <Controller
                name="system.theme_dark"
                control={control}
                render={({ field }) => (
                  <Switch
                    disabled

                    checked={field.value}
                    className="bg-[#2C2828] ring-0 border-0"
                    id="night-mode"
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </Field>

            <Field className="flex flex-row items-center justify-between w-full opacity-30">
              <Label
                htmlFor="notifications-mode"
                className="font-light text-sm"
              >
                Habilitar notificações
              </Label>
              <Controller
                name="system.notifications_enabled"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    className="bg-[#2C2828] ring-0 border-0"
                    id="notifications-mode"
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <button
              className={
                "font-normal mt-6 text-white bg-[#3D6A3F] rounded-3xl h-10 grow hover:contrast-125 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              }
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Confirmar"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
