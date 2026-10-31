import { useEffect } from "react";
import {
  Link, NavLink, Route, Routes,
  useParams, useSearchParams
} from "react-router";
import { useFavorites } from "./hooks/useFavorites";

const PRODUCTS = [
  { id: 1, name: "Buku React", price: 85000, category: "Buku", icon: "⚛️" },
  { id: 2, name: "Buku Web", price: 70000, category: "Buku", icon: "🌐" },
  { id: 3, name: "Keyboard", price: 150000, category: "Aksesori", icon: "⌨️" },
  { id: 4, name: "Mouse", price: 90000, category: "Aksesori", icon: "🖱️" }
];

const CATEGORIES = ["Semua", "Buku", "Aksesori"];

const rupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);

// Custom hook 3: mengubah judul tab browser.
// Cleanup mengembalikan judul sebelumnya saat halaman dilepas.
function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}

export default function App() {
  const { ids, storageError } = useFavorites();

  return (
    <div className="shell">
      <header className="sidebar">
        <div className="brand">
          <span className="logo" aria-hidden="true">LP</span>
          <h1>Lapak Praktikum</h1>
        </div>
        <nav aria-label="Navigasi utama">
          <NavLink to="/" end>Beranda</NavLink>
          <NavLink to="/products">Produk</NavLink>
          <NavLink to="/favorites">Favorit ({ids.length})</NavLink>
          <NavLink to="/about">Tentang</NavLink>
        </nav>
      </header>
      <div className="content">
        <main>
          {storageError && <p role="alert" className="alert">{storageError}</p>}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Catalog />} />
            <Route path="/products/:id" element={<Detail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="site-footer">
          Praktikum Effect, Custom Hook, dan Router
        </footer>
      </div>
    </div>
  );
}

function Home() {
  usePageTitle("Beranda Katalog");
  return (
    <section>
      <div className="hero">
        <h2>Selamat datang di Lapak Praktikum</h2>
        <p>Pilih produk dan simpan sebagai favorit.</p>
        <Link to="/products" className="cta">Buka katalog</Link>
      </div>
      <div className="features">
        <div className="feature">
          <span aria-hidden="true">🔎</span>
          <h3>Cari dan filter</h3>
          <p>Cari nama produk dan pilih kategori. Keduanya tersimpan di URL.</p>
        </div>
        <div className="feature">
          <span aria-hidden="true">♥</span>
          <h3>Simpan favorit</h3>
          <p>Tandai produk favorit dari katalog atau halaman detail.</p>
        </div>
        <div className="feature">
          <span aria-hidden="true">💾</span>
          <h3>Tidak hilang</h3>
          <p>Favorit disimpan di browser, jadi tetap ada setelah reload.</p>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  const { ids, toggle } = useFavorites();
  const selected = ids.includes(product.id);
  return (
    <article className="card" data-category={product.category}>
      <div className="thumb" aria-hidden="true">{product.icon}</div>
      <div className="card-body">
        <p className="category">{product.category}</p>
        <h3>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="price">{rupiah(product.price)}</p>
        <button
          type="button"
          className="fav-btn"
          aria-pressed={selected}
          onClick={() => toggle(product.id)}
        >
          {selected ? "Hapus favorit" : "Tambah favorit"}
        </button>
      </div>
    </article>
  );
}

function Catalog() {
  usePageTitle("Katalog Produk");
  const [params, setParams] = useSearchParams();

  // q dan category sama-sama dibaca dari URL, tidak disimpan di useState
  const q = params.get("q") ?? "";
  const rawCategory = params.get("category") ?? "Semua";
  // kalau isi category di URL tidak dikenal, dianggap "Semua"
  const category = CATEGORIES.includes(rawCategory) ? rawCategory : "Semua";

  // hasil filter dihitung langsung saat render, tidak perlu useEffect
  const filtered = PRODUCTS.filter((product) => {
    const cocokNama = product.name.toLowerCase().includes(q.toLowerCase());
    const cocokKategori = category === "Semua" || product.category === category;
    return cocokNama && cocokKategori;
  });

  // Mengubah satu parameter saja. URLSearchParams disalin dulu dari params
  // sehingga parameter yang lain (q / category) tetap terbawa.
  function updateParam(key, value, replace) {
    const next = new URLSearchParams(params);
    if (value && !(key === "category" && value === "Semua")) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setParams(next, { replace });
  }

  // Reset menghapus q dan category sekaligus, dan dibuat sebagai entri history baru
  function resetFilter() {
    setParams(new URLSearchParams(), { replace: false });
  }

  return (
    <section>
      <h2>Produk</h2>

      <div className="toolbar">
        <div className="field">
          <label htmlFor="search">Cari produk</label>
          <input
            id="search"
            value={q}
            onChange={(event) => updateParam("q", event.target.value, true)}
            placeholder="Contoh Buku"
          />
        </div>

        <div className="field">
          <label htmlFor="category">Kategori</label>
          <select
            id="category"
            value={category}
            onChange={(event) => updateParam("category", event.target.value, false)}
          >
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <button type="button" className="secondary" onClick={resetFilter}>
          Reset pencarian
        </button>
      </div>

      <p className="count">{filtered.length} produk ditemukan</p>
      <div className="grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {filtered.length === 0 && <p className="empty">Produk tidak ditemukan.</p>}
    </section>
  );
}

function Detail() {
  const { id } = useParams();
  const product = PRODUCTS.find((item) => String(item.id) === id);
  usePageTitle(product ? product.name : "Produk tidak ditemukan");
  return (
    <section className="detail">
      <h2>Detail produk</h2>
      {product ? (
        <ProductCard product={product} />
      ) : (
        <p className="empty">ID produk tidak tersedia.</p>
      )}
      <Link to="/products" className="back">&larr; Kembali ke katalog</Link>
    </section>
  );
}

function Favorites() {
  usePageTitle("Produk Favorit");
  const { ids, clearAll } = useFavorites();
  const selected = PRODUCTS.filter((item) => ids.includes(item.id));
  return (
    <section>
      <div className="section-head">
        <h2>Produk favorit</h2>
        {ids.length > 0 && (
          <button type="button" className="danger" onClick={clearAll}>
            Hapus semua favorit
          </button>
        )}
      </div>
      <div className="grid">
        {selected.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {selected.length === 0 && <p className="empty">Belum ada produk favorit.</p>}
    </section>
  );
}

function About() {
  usePageTitle("Tentang Aplikasi");
  return (
    <section className="panel">
      <h2>Tentang aplikasi</h2>
      <p>
        Aplikasi ini dibuat untuk praktikum Effect, Custom Hook, dan Router
        pada React. Isinya katalog empat produk contoh yang bisa dicari,
        difilter berdasarkan kategori, dan ditandai sebagai favorit.
      </p>
      <p>
        Daftar favorit dibagikan lewat Context, disimpan di localStorage,
        sedangkan kata pencarian dan kategori disimpan di URL.
      </p>
      <Link to="/products" className="cta">Lihat katalog</Link>
    </section>
  );
}

function NotFound() {
  usePageTitle("Halaman tidak ditemukan");
  return (
    <section className="panel">
      <h2>Halaman tidak ditemukan</h2>
      <Link to="/" className="cta">Kembali ke beranda</Link>
    </section>
  );
}
