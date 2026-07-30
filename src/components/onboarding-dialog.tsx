/** @format */

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfileInput, ProfileSettings } from "@/db/schemas";
import { AuthService } from "@/db/services/auth.service";
import { useAuthStore } from "@/store/use-auth-store";
import { useEffect, useState } from "react";
import { DatePicker } from "./date-picker";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { Upload } from "lucide-react";
import { StorageService } from "@/db/services/storage.service";

interface onboardingForm {
  name: string;
  bornDate?: string;
  avatarFile?: FileList;
}

export function OnboardingModal({
  onSuccess,
  show,
}: {
  onSuccess: () => void;
  show: boolean;
}) {
  const user = useAuthStore((s) => s.user);
  const setProfile = useAuthStore((s) => s.setProfile);

  const onSubmit: SubmitHandler<onboardingForm> = async (data) => {
    if (!user) return;

    const file = data.avatarFile?.[0];
    let avatarUrl: string | null = null;

    if (file) {
      // 2. Chama o serviço e desestrutura { publicUrl, error }
      const { publicUrl, error: uploadError } =
        await StorageService.compressAndStoreImage({
          bucket: "pictures",
          file,
          userId: user.id,
        });

      // 3. Lança o erro se o upload falhar
      if (uploadError || !publicUrl) {
        throw new Error(
          `Falha ao enviar a foto de perfil: ${uploadError || "URL pública não gerada"}`,
        );
      }

      avatarUrl = publicUrl;
    }

    const profile: ProfileInput = {
      id: user.id,
      name: data.name!,
      email: user.email!,
      avatarUrl: avatarUrl,
      bornDate: data.bornDate,
      provider: "magiclink",
    };

    const profileSettings: ProfileSettings = {
      userId: user.id,
      themeDark: true,
      language: "pt-BR",
      notificationsEnabled: true,
    };

    const { data: profileUser, error } = await AuthService.onboardUser({
      profile,
      profileSettings,
    });

    if (error && !profileUser) {
      console.error(error);
    } else {
      setProfile(profileUser);
      onSuccess();
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<onboardingForm>({
    values: {
      name: "",
      bornDate: "",
      avatarFile: undefined,
    },
  });

  const avatarFile = useWatch({ control, name: "avatarFile" });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (avatarFile && avatarFile.length > 0) {
      const file = avatarFile[0];
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [avatarFile]);
  return (
    <AlertDialog open={show}>
      <AlertDialogContent className="sm:max-w-sm bg-[#211E21] ring-0 text-white">
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-md font-medium">
              Primeiros passos{" "}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-light">
              Vamos finalizar seu cadastro, informe seus dados para podermos
              oferecer uma experiência mais customizada.{" "}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FieldGroup className="gap-3 mt-4">
            <Field className="gap-2 flex items-center justify-center w-full ">
              <span className="text-xs opacity-45 text-center">
                Imagem de perfil
              </span>
              <Label
                className="   flex flex-col items-center justify-center gap-2"
                htmlFor="avatar-upload"
              >
                <span className="size-24 rounded-full flex items-center justify-center bg-[#2C2828]">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview do avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Upload className="size-5 opacity-45 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                </span>
                <span className="text-xs opacity-45 text-center">
                  Aceitamos .jpg, .png ou .jpeg
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
              <Label className="font-light text-sm" htmlFor="name">
                Nome*
              </Label>
              <Input
                className="bg-[#2C2828] ring-0! outline-0! border-0! rounded-xl h-10 font-light"
                required
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
              <Label className="font-light text-sm" htmlFor="bornDate">
                Data de Nascimento
              </Label>{" "}
              <DatePicker control={control} controlName={"bornDate"} />
            </Field>
          </FieldGroup>
          <AlertDialogFooter>
            <button
              className={
                " font-normal mt-6 text-red-200 bg-[#3D6A3F] rounded-3xl h-10 grow hover:contrast-125 cursor-pointer"
              }
              type="submit"
            >
              Confirmar
            </button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
