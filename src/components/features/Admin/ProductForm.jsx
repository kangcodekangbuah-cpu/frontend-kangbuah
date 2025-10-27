const ProductForm = ({ editingId, formState, setFormState, onFilesChange, onSubmit, onCancel, newImagePreviews }) => {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setFormState(prev => ({
      ...prev,
      image_url: prev.image_url.filter((_, index) => index !== indexToRemove)
    }));
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
          {editingId && (
            <>
              Status
              <select
                name="status"
                value={formState.status}
                onChange={handleInputChange}
              >
                <option value="TERSEDIA">TERSEDIA</option>
                <option value="STOK_MENIPIS">STOK_MENIPIS</option>
                <option value="STOK_HABIS">STOK_HABIS</option>
                <option value="TIDAK_AKTIF">TIDAK_AKTIF</option>
              </select>
            </>
          )}
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
          Persediaan
          <input
            name="stock"
            type="number"
            value={formState.stock}
            onChange={handleInputChange}
            required
          />
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

        <div className="image-preview-section">
          {editingId && formState.image_url && formState.image_url.length > 0 && (
            <>
              <p className="preview-title">Gambar Saat Ini:</p>
              <div className="image-preview-container">
                {formState.image_url.map((url, index) => (
                  <div key={index} className="preview-item">
                    <img src={url} alt="Preview Gambar Lama" />
                    <button type="button" onClick={() => handleRemoveExistingImage(index)} title="Hapus gambar">
                      <svg viewBox="0 0 448 512" width="12" height="12" fill="currentColor">
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {newImagePreviews && newImagePreviews.length > 0 && (
            <>
              <p className="preview-title">Gambar Baru (Akan Diupload):</p>
              <div className="image-preview-container">
                {newImagePreviews.map((url, index) => (
                  <div key={index} className="preview-item">
                    <img src={url} alt="Preview Gambar Baru" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

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
