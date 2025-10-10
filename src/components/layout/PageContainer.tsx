import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className={`container mx-auto max-w-7xl p-6 space-y-8 ${className}`}>
        {children}
      </div>
    </div>
  );
}
