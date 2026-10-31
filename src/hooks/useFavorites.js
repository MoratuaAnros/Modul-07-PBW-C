import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";

// Custom hook 2: hanya MEMBACA state bersama dari Provider.
// Di sini tidak ada useState, jadi tidak membuat state baru.
export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (value === null) {
    throw new Error("useFavorites harus di dalam provider");
  }
  return value;
}
