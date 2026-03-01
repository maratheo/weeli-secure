"use client";

import * as React from "react";
import { GripVerticalIcon } from "lucide-react";

import { cn } from "./utils";

// Simplified resizable components (react-resizable-panels has type incompatibility issues)
// These are placeholder components for compatibility

const ResizablePanelGroup = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex h-full w-full", className)} {...props}>
    {children}
  </div>
);

const ResizablePanel = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1", className)} {...props}>
    {children}
  </div>
);

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  withHandle?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-border relative flex w-px items-center justify-center",
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border">
          <GripVerticalIcon className="size-2.5" />
        </div>
      )}
    </div>
  );
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
