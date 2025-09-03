"use client";
import Link from "next/link";
import { track } from "@/lib/track";

type Props = React.ComponentProps<typeof Link> & {
  event?: string;
  payload?: Record<string, unknown>;
};

export default function BuyLink({ event = "buy_click", payload, ...rest }: Props) {
  return <Link {...rest} onClick={() => track(event, payload)} />;
}
