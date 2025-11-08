import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../../components/features/Admin/AdminHeader";
import ProductForm from "../../../components/features/Admin/ProductForm";
import ProductTable from "../../../components/features/Admin/ProductTable";
import apiClient from "../../../services/api";
import { useAuthStore } from "../../../store/authStore";
import { toast } from 'react-toastify';
import "./AdminCatalog.css";

export default function AdminCatalogPage() {
  const router = useNavigate();
  const user = useAuthStore((state) => state.user);
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
  const [form, setForm] = useState({ name: "", category: "BUAH", price: "", description: "", unit: "", stock: "", image_url: [], status: "TERSEDIA" });
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/products?page=${page}&limit=10`);

      setProducts(res.data.data.data);
      setPagination({
        page: res.data.data.page,
        max_page: res.data.data.max_page,
        total: res.data.data.total,
      });

    } catch (error) {
      console.error("Gagal mengambil data produk:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  useEffect(() => {

    if (user) {
      if (user.role !== "ADMIN") {
        toast.error("Anda tidak memiliki hak akses admin.");
        router("/catalog");
      }
    }
    
    else if (!user && useAuthStore.getState().accessToken === null) {
       router("/");
    }
  }, [user, router]);

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetchProducts(pagination.page);
    }
  }, [pagination.page, user]);

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", category: "BUAH", price: "", description: "", unit: "", stock: "", image_url: [], status: "TERSEDIA" });
    setSelectedFiles(null);
    document.getElementById('image-upload').value = null;

    newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    setNewImagePreviews([]);
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);

    newImagePreviews.forEach(url => URL.revokeObjectURL(url));

    if (e.target.files && e.target.files.length > 0) {
      const previews = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setNewImagePreviews(previews);
    } else {
      setNewImagePreviews([]);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("type", form.category);
    formData.append("price", form.price);
    formData.append("unit", form.unit);
    formData.append("description", form.description);
    formData.append("stock", form.stock);

    if (selectedFiles && selectedFiles.length > 0) {
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("image", selectedFiles[i]);
      }
    }

    try {
      let res;

      if (editingId) {

        const existingImageCount = form.image_url ? form.image_url.length : 0;
        const newImageCount = selectedFiles ? selectedFiles.length : 0;
        formData.append("status", form.status)

        if (existingImageCount + newImageCount === 0) {
          toast.error("Produk harus memiliki minimal 1 gambar.");
          return;
        }

        if (form.image_url && form.image_url.length > 0) {
          form.image_url.forEach(url => {
            formData.append("existing_image_url[]", url);
          });
        } else {
          formData.append("existing_image_url[]", "");
        }

        res = await apiClient.patch(`/products/${editingId}`, formData);
        toast.success("Produk berhasil diperbarui!");
      } else {
        if (!selectedFiles || selectedFiles.length === 0) {
          toast.error("Minimal satu gambar per produk.");
          return;
        }

        res = await apiClient.post("/products", formData);
        toast.success("Produk baru berhasil ditambahkan!");
      }

      fetchProducts(pagination.page);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || "Terjadi kesalahan saat menyimpan produk.");
    }
  };


  const onEdit = (p) => {
    setEditingId(p.product_id);
    setForm({
      name: p.name,
      category: p.type,
      status: p.status,
      price: String(p.price),
      unit: p.unit,
      stock: p.stock,
      description: p.description,
      image_url: p.image_url || [],
    });

    newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    setNewImagePreviews([]);
    setSelectedFiles(null);
    document.getElementById('image-upload').value = null;
  };

  const onDelete = async (id) => {
    if (!confirm("Anda yakin ingin menghapus produk ini?")) return;

    try {
      await apiClient.delete(`/products/${id}`);
      toast.success("Produk berhasil dihapus!");
      fetchProducts(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus produk.");
    }
  };

  const getStatusPriority = (status) => {
    switch (status) {
      case 'STOK_MENIPIS':
        return 1;
      case 'STOK_HABIS':
        return 2;
      case 'TIDAK_AKTIF':
        return 3;
      default:
        return 4;
    }
  };

  const filtered = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products
      .filter((p) => (filter === "all" ? true : p.type === filter))
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        const priorityA = getStatusPriority(a.status);
        const priorityB = getStatusPriority(b.status);

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        return a.name.localeCompare(b.name)
      });
  }, [products, query, filter]);

  const formatPrice = (price) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  return (
    <div className="admin-cat-page">
      <AdminHeader />
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
              newImagePreviews={newImagePreviews}
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