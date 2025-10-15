import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

interface AppHeaderProps {
  title: string;
  description?: string;
}

export default function AppHeader({ title, description }: AppHeaderProps) {
  const { signOut } = useAuthActions();

  return (
    <header className="space-y-2 flex justify-between items-center">
      <div className="flex flex-col justify-between">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      <Button variant="outline" onClick={() => signOut()}>
        <LogOut className="mr-2 h-3 w-3" />
        Logout
      </Button>
    </header>
  );
}
