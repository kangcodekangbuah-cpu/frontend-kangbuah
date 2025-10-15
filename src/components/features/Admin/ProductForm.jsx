const ProductForm = ({ editingId, formState, setFormState, onFilesChange, onSubmit, onCancel }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevForm) => ({ ...prevForm, [name]: value }));
  };

  return (
    <section className="form-card">
      <h3>{editingId ? "Ubah Produk" : "Tambah Produk"}</h3>

      <form onSubmit={onSubmit} className="form">
        <label>
          Nama
          <input
            name="name"
            value={formState.name}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Kategori
          <select
            name="category"
            value={formState.category}
            onChange={handleInputChange}
          >
            <option value="BUAH">Buah-buahan</option>
            <option value="SAYUR">Sayuran</option>
            <option value="LAIN_LAIN">Permintaan Khusus</option>
          </select>
        </label>

        <label>
          Harga
          <input
            name="price"
            type="number"
            min="0"
            value={formState.price}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Deskripsi
          <textarea
            name="description"
            value={formState.description}
            onChange={handleInputChange}
            rows="2"
          />
        </label>

        <label>
          Satuan
          <input
            name="unit"
            value={formState.unit}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Stok
          <input
            name="stock"
            value={formState.stock}
            onChange={handleInputChange}
            required
          />
        </label>

        {/* 🟢 Bagian Upload Gambar */}
        <label>
          Gambar Produk (Maks. 5)
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={onFilesChange}
          />
          {editingId ? (
            <small className="text-gray-500">
              *Kosongkan jika tidak ingin mengubah gambar produk.
            </small>
          ) : (
            <small className="text-gray-500">
              *Wajib upload minimal satu gambar produk.
            </small>
          )}
        </label>

        {/* Tombol aksi */}
        <div className="actions">
          <button type="submit" className="save">
            {editingId ? "Simpan Perubahan" : "Tambah"}
          </button>
          {editingId && (
            <button type="button" className="cancel" onClick={onCancel}>
              Batal
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default ProductForm;
