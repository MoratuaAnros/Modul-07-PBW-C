import { useEffect, useState } from "react";

const KEY = "praktikum-favorites-v1";

// Baca daftar id favorit dari localStorage.
// Kalau datanya tidak ada atau rusak, dianggap kosong supaya aplikasi tidak error.
function readIds() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return [];
    const value = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    // hanya ambil id yang berupa bilangan bulat positif dan buang duplikat
    return [...new Set(value.filter((id) => Number.isInteger(id) && id > 0))];
  } catch {
    return [];
  }
}

// Custom hook 1: mengelola state favorit + menyimpannya ke localStorage.
// Hook ini hanya dipanggil SATU kali, yaitu di FavoritesProvider.
export function usePersistentFavorites() {
  // readIds dikirim sebagai fungsi (lazy initializer) supaya hanya jalan sekali saat awal
  const [ids, setIds] = useState(readIds);
  const [storageError, setStorageError] = useState("");

  // Effect: setiap ids berubah, salin ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
      setStorageError("");
    } catch {
      setStorageError("Favorit belum tersimpan di browser.");
    }
  }, [ids]);

  function toggle(id) {
    setIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  }

  // Tugas mandiri: hapus semua favorit.
  // Cukup set ids jadi array kosong, nanti Effect di atas otomatis
  // menyimpan [] ke localStorage jadi tidak perlu menulis storage lagi di sini.
  function clearAll() {
    setIds([]);
  }

  return { ids, toggle, clearAll, storageError };
}
