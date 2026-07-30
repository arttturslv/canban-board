/** @format */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/db/services/auth.service";
import { useRouter } from "@tanstack/react-router";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

export function LoginDialog({ isLogged }: { isLogged: boolean }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const wasSend = useRef(false);
  const [isPending, startTransition] = useTransition();

  const signIn = async () => {
    startTransition(async () => {
      const { error: ApiError } = await AuthService.signInWithEmail({ email });

      if (ApiError) {
        toast.error(ApiError?.message || "Erro desconhecido");
      } else {
        wasSend.current = true;
      }
    });
  };

  const goBack = async () => {
    router.history.back();
  };

  return (
    <AlertDialog open={isLogged}>
      <form>
        <AlertDialogContent className="sm:max-w-sm bg-[#211E21] gap-5 ring-0 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-md font-medium">
              {isPending || wasSend.current
                ? "Verifique seu e-mail"
                : "Conectar"}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-light">
              {isPending || wasSend.current
                ? "Um link foi enviado para o seu e-mail, permitindo um login rapido e fácil."
                : `Conecte-se rapidamente sem senha. Digite seu e-mail e você
                receberá um link de acesso para logar.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          {!isPending && !wasSend.current && (
            <>
              <FieldGroup>
                <Field className="gap-2">
                  <Label className="font-light text-sm" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    className="bg-[#2C2828] ring-0! outline-0! border-0! rounded-xl h-10 font-light"
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    name="email"
                    defaultValue="pedrodu@gmail.com"
                  />
                </Field>
              </FieldGroup>
              <AlertDialogFooter className="w-full ">
                <AlertDialogCancel
                  variant={"default"}
                  onClick={goBack}
                  className={
                    " font-normal text-white bg-zinc-500/20 hover:bg-zinc-500/40 h-10  px-8  cursor-pointer border-0"
                  }
                >
                  Voltar
                </AlertDialogCancel>
                <AlertDialogAction
                  className={
                    " font-normal text-red-200 bg-[#3D6A3F] h-10 grow hover:contrast-125 cursor-pointer"
                  }
                  onClick={signIn}
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </form>
    </AlertDialog>
  );
}
