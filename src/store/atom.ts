import { atom } from "jotai";
import { Product } from "@/types";

export const selectProductAtom = atom<Product | null>(null);
export const alertProductAtom = atom<Product | null>(null);
