const ProductTable = ({ products, onEdit, onDelete, formatPrice }) => {

    const getStatusClass = (status) => {
        switch (status) {
            case 'STOK_MENIPIS':
                return 'status-warning';
            case 'STOK_HABIS':
            case 'TIDAK_AKTIF':
                return 'status-danger';
            default:
                return '';
        }
    };

    return (
        <section className="table-card">
            <h3>Daftar Produk</h3>
            <div className="table-wrap">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Gambar</th>
                            <th>Nama</th>
                            <th>Kategori</th>
                            <th>Harga</th>
                            <th>Satuan</th>
                            <th>Persediaan</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.product_id} className={getStatusClass(p.status)}>
                                <td>
                                    {/* Cek jika p.image_url adalah array dan punya isi */}
                                    {Array.isArray(p.image_url) && p.image_url.length > 0 ? (
                                        <img
                                            src={p.image_url[0]} // Tampilkan gambar pertama
                                            alt={p.name}
                                            className="thumb"
                                        />
                                    ) : (
                                        <span className="noimg">—</span>
                                    )}
                                </td>
                                <td>{p.name}</td>
                                <td>{p.type}</td>
                                <td>{formatPrice(p.price)}</td>
                                <td>{p.unit}</td>
                                <td>{p.stock}</td>
                                <td>{p.status}</td>
                                <td className="actions-td">
                                    <button className="edit" onClick={() => onEdit(p)}>
                                        Ubah
                                    </button>
                                    <button className="del" onClick={() => onDelete(p.product_id)}>
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={6} className="empty">
                                    Tidak ada produk yang cocok dengan pencarian/filter Anda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default ProductTable;