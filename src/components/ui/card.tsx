import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className, ...rest } = props;
  return (
    <div
      className={cn("rounded-2xl border border-zinc-700 bg-zinc-900", className)}
      {...rest}
    />
  );
};

export const CardContent = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { className, ...rest } = props;
  return <div className={cn("p-6", className)} {...rest} />;
};

export default Card;

