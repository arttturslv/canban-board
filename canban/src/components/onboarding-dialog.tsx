/** @format */

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile, ProfileSettings } from "@/db/schemas";
import { AuthService } from "@/db/services/auth.service";
import { useAuthStore } from "@/store/use-auth-store";
import { useState } from "react";

export function OnboardingModal({
  onSuccess,
  show,
}: {
  onSuccess: () => void;
  show: boolean;
}) {
  const user = useAuthStore((s) => s.user);
  const setProfile = useAuthStore((s) => s.setProfile);
  const [error, setError] = useState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const profile: Profile = {
      id: user.id,
      email: user.email!,
      name,
      username: username || name + user.email!.slice(0, 5),
      avatarUrl: null,
      provider: "magiclink",
      createdAt: new Date().toISOString(),
    };

    const profileSettings: ProfileSettings = {
      userId: user.id,
      theme: "dark",
      language: "pt-BR",
      notificationsEnabled: true,
    };

    const { error } = await AuthService.onboardUser({
      profile,
      profileSettings,
    });

    if (error) {
      setError(error);
      console.error(error);
    }

    setProfile(profile);
    onSuccess();
  };

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  return (
    <AlertDialog open={show}>
      <form>
        <AlertDialogTrigger render={<Button variant="outline">Login</Button>} />
        <AlertDialogContent className="sm:max-w-sm bg-[#0a040c] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Boas-vindas! Como podemos te chamar?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Vamos completar seu login
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="name">Nome</Label>
              <Input
                className="bg-[#252323] ring-0! outline-0! border-0!"
                onChange={(e) => setName(e.target.value)}
                id="name"
                name="name"
                required
                defaultValue="Pedro Lopes"
              />
            </Field>
            <Field>
              <Label htmlFor="username">Username</Label>
              <Input
                className="bg-[#252323] ring-0! outline-0! border-0!"
                onChange={(e) => setUsername(e.target.value)}
                id="username"
                name="username"
                required
                defaultValue="PeLopes"
              />
            </Field>
          </FieldGroup>
          {error && <span className="text-red-400 text-sm">{error}</span>}
          <AlertDialogFooter>
            <Button onClick={handleSubmit} type="button">
              Salvar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </AlertDialog>
  );
}
