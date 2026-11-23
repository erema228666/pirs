/* eslint-disable @typescript-eslint/ban-ts-comment */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Treaty } from "@elysiajs/eden";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// @ts-ignore
type TreatyFunction = (...args: any) => Promise<Treaty.TreatyResponse<unknown>>;

export type InferTreatyReturnType<T extends TreatyFunction> = NonNullable<
  Awaited<ReturnType<T>>["data"]
>;