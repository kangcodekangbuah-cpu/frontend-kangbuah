import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../../components/features/Admin/AdminHeader";
import ProductForm from "../../../components/features/Admin/ProductForm";
import ProductTable from "../../../components/features/Admin/ProductTable";
import axios from "axios"
import "./AdminCatalog.css";

const defaultProducts = [
  {
    id: 1,
    name: "Wortel 1kg",
    category: "SAYUR",
    price: 15000,
    unit: "1kg",
    image: "/fresh-carrots.png",
  },
  {
    id: 2,
    name: "Semangka Non Biji",
    category: "BUAH",
    price: 25000,
    unit: "1 buah",
    image: "/seedless-watermelon.jpg",
  },
  {
    id: 3,
    name: "Beras Premium 5kg",
    category: "LAIN_LAIN",
    price: 85000,
    unit: "5kg",
    image: "/white-rice-grains.jpg",
  },
];

export default function AdminCatalogPage() {
  // Semua state dan logika tetap berada di halaman utama ini
  const router = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [pagination, setPagination] = useState({ 
    page: 1,
    max_page: 1,
    total: 0,
  });
  const [form, setForm] = useState({ name: "", category: "BUAH", price: "", description: "", unit: "", stock: ""});

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3000/products?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("product:", res.data.data)
      
      setProducts(res.data.data.result);
      setPagination({
        page: res.data.data.page,
        max_page: res.data.data.max_page,
        total: res.data.data.total,
      });

    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
      // Anda bisa menggunakan toast di sini untuk notifikasi error
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    fetchProducts(pagination.page);
  }, [pagination.page]);

  const saveProducts = (next) => {
    setProducts(next);
    localStorage.setItem("adminProducts", JSON.stringify(next));
  };
  
  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", category: "BUAH", price: "", description: "", unit: "", stock:"" });
    setSelectedFiles(null);
    document.getElementById('image-upload').value = null;
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };
  
  const onSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', form.name);
  formData.append('type', form.category);
  formData.append('price', form.price);
  formData.append('unit', form.unit);
  formData.append('description', form.description);
  formData.append('stock', form.stock);

  // Tambahkan file baru jika ada
  if (selectedFiles) {
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('image', selectedFiles[i]);
    }
  }
  
  try {
    const token = localStorage.getItem('token');
    let res;

    if (editingId) {
      // LOGIKA UNTUK UPDATE (PATCH)
      res = await axios.patch(`http://localhost:3000/products/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Produk berhasil diperbarui!");
    } else {
      // LOGIKA UNTUK CREATE (POST)
      if (!selectedFiles || selectedFiles.length === 0) {
        alert("Silakan pilih minimal satu gambar produk.");
        return;
      }
      res = await axios.post("http://localhost:3000/products", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Produk baru berhasil ditambahkan!");
    }

    fetchProducts(pagination.page); // Muat ulang data setelah create/update
    resetForm();

  } catch (err) {
    console.error("Gagal menyimpan produk:", err);
    alert(err.response?.data?.message || "Terjadi kesalahan saat menyimpan produk.");
  }
};
  
  const onEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, category: p.category, price: String(p.price), unit: p.unit, stock: p.stock, description: p.description });
  };
  
  const onDelete = async (id) => {
  if (!confirm("Anda yakin ingin menghapus produk ini?")) return;
  console.log("ID yang akan dihapus:", id);
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:3000/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Produk berhasil dihapus!");
    fetchProducts(pagination.page); // Muat ulang data
  } catch (err) {
    console.error("Gagal menghapus produk:", err);
    alert(err.response?.data?.message || "Gagal menghapus produk.");
  }
};
  
  const filtered = useMemo(() => {
  if (!Array.isArray(products)) return [];
  
  return products
    .filter((p) => (filter === "all" ? true : p.type === filter)) // Ubah p.category jadi p.type
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));
}, [products, query, filter]);
  
  const formatPrice = (price) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);
  
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    router("/", { replace: true });
  };

  return (
    <div className="admin-cat-page">
      <AdminHeader onLogout={logout} />
      <main className="admin-cat-main">
        <div className="maxw">
          <div className="toolbar">
            <input
              className="search"
              placeholder="Cari produk..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Semua Kategori</option>
              <option value="BUAH">Buah-buahan</option>
              <option value="SAYUR">Sayuran</option>
              <option value="LAIN_LAIN">Permintaan Khusus</option>
            </select>
          </div>
          <div className="grid">
            <ProductForm
              editingId={editingId}
              formState={form}
              setFormState={setForm}
              onFilesChange={handleFileChange}
              onSubmit={onSubmit}
              onCancel={resetForm}
            />
            <ProductTable
              products={filtered}
              onEdit={onEdit}
              onDelete={onDelete}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </main>
    </div>
  );
}