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
import type { AuthError } from "@supabase/supabase-js";
import { useRouter } from "@tanstack/react-router";
import { useState, useTransition } from "react";

export function LoginDialog({ isLogged }: { isLogged: boolean }) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<AuthError | null>();

  const signIn = async () => {
    startTransition(async () => {
      const { error: ApiError } = await AuthService.signInWithEmail({ email });
      setError(ApiError);
    });
  };

  const goBack = async () => {
    router.history.back();
  };

  return (
    <AlertDialog open={isLogged}>
      {error ? (
        <div>error</div>
      ) : (
        <form>
          <AlertDialogContent className="sm:max-w-sm bg-[#211E21] gap-5 ring-0 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-md font-medium">
                {isPending ? "Verifique seu e-mail" : "Conectar"}
              </AlertDialogTitle>
              <AlertDialogDescription className="font-light">
                {isPending
                  ? "Um link foi enviado para o seu e-mail, permitindo um login rapido e fácil."
                  : `Conecte-se rapidamente sem senha. Digite seu e-mail e você
                receberá um link de acesso para logar.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            {!isPending && (
              <>
                {" "}
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
      )}
    </AlertDialog>
  );
}
