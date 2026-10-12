import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

interface ErrorNoticeProps {
  title: string;
  description?: string | undefined;
  action?: ReactNode;
}

const ErrorNotice = ({ title, description, action }: ErrorNoticeProps) => {
  return (
    <div role="alert" className="flex flex-col items-center rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
      <span className="mb-3 inline-flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-5" />
      </span>
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default ErrorNotice;
