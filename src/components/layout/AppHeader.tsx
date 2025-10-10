interface AppHeaderProps {
  title: string;
  description?: string;
}

export default function AppHeader({ title, description }: AppHeaderProps) {
  return (
    <header className="space-y-2">
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </header>
  );
}
