import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "~/lib/utils";
import { twMerge } from "tailwind-merge";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

const TooltipPointer = ({
  theme,
  position = "left",
}: {
  theme: "light" | "dark";
  position?: "left" | "middle" | "right";
}) => {
  const fill = theme === "light" ? "white" : "black";
  const left =
    position === "left"
      ? ""
      : position === "middle"
      ? "left-1/2 transform -translate-x-1/2"
      : "right-2";

  return (
    <div className={twMerge("absolute -top-2 border-[#0a0a0a]", left)}>
      <svg
        width="14"
        height="10"
        viewBox="0 0 14 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.19615 0.999999C5.96595 -0.333335 7.89045 -0.333333 8.66025 1L13.8564 10H0L5.19615 0.999999Z"
          fill={fill}
        />
      </svg>
    </div>
  );
};

const SimpleTooltip = ({
  children,
  content,
  position = "left",
}: {
  children: React.ReactNode;
  content: string;
  position?: "left" | "middle" | "right";
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="relative overflow-visible font-ubuntu"
        >
          <span className="dark:hidden">
            <TooltipPointer theme="dark" position={position} />
          </span>
          <span className="hidden dark:block">
            <TooltipPointer theme="light" position={position} />
          </span>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export {
  SimpleTooltip,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
};
