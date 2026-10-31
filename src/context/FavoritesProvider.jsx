import { FavoritesContext } from "./FavoritesContext";
import { usePersistentFavorites } from "../hooks/usePersistentFavorites";

// Provider = pemilik state favorit.
// usePersistentFavorites() dipanggil di sini saja (satu kali), lalu hasilnya
// dibagikan lewat Context. Halaman lain tidak memanggil hook ini lagi,
// jadi semua halaman membaca state yang sama.
export function FavoritesProvider({ children }) {
  const value = usePersistentFavorites();
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
