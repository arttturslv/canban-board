/** @format */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/db/services/auth.service";
import type { AuthError } from "@supabase/supabase-js";
import { useState, useTransition } from "react";

export function LoginDialog() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<AuthError | null>();

  const signIn = async () => {
    startTransition(async () => {
      const { error: ApiError } = await AuthService.signInWithEmail({ email });
      setError(ApiError);
    });
  };

  return (
    <Dialog>
      {isPending ? (
        <div>Verifique seu e-mail</div>
      ) : error ? (
        <div>error</div>
      ) : (
        <form>
          <DialogTrigger render={<Button variant="outline">Login</Button>} />
          <DialogContent className="sm:max-w-sm bg-[#0a040c] text-white">
            <DialogHeader>
              <DialogTitle>Login</DialogTitle>
              <DialogDescription>
                Faça login para acessar de multiplos dispositivos, compartilhar
                e comentar em tarefas.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="email">Email</Label>
                <Input
                  className="bg-[#252323] ring-0! outline-0! border-0!"
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  defaultValue="pedrodu@gmail.com"
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button onClick={signIn} type="button">
                Login
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      )}
    </Dialog>
  );
}
