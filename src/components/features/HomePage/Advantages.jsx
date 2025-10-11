import "./Advantages.css"

export default function Advantages() {
  const advantages = [
    {
      title: "Langsung Dari Sumber Buah dan Sayuran di Pasar Induk",
      description:
        "Kami mengambil produk langsung dari sumber terpercaya di Pasar Induk untuk menjamin kualitas dan kesegaran",
    },
    {
      title: "Kesegaran Terjamin Pengiriman Cepat Setelah Pengiriman Barang",
      description: "Sistem distribusi yang efisien memastikan produk sampai dalam kondisi segar dan berkualitas tinggi",
    },
    {
      title: "Pelayanan Personal Mengenal Kebutuhan Tiap Mitra Dan Beradaptasi Secara Fleksibel",
      description: "Tim kami memahami kebutuhan unik setiap klien dan memberikan solusi yang disesuaikan",
    },
  ]

  return (
    <section className="advantages">
      <div className="advantages-background">
        <div className="organic-shape shape-1"></div>
        <div className="organic-shape shape-2"></div>
        <div className="organic-shape shape-3"></div>
      </div>

      <div className="advantages-container">
        <h2 className="advantages-title">KEUNGGULAN KAMI</h2>

        <div className="advantages-grid">
          {advantages.map((advantage, index) => (
            <div key={index} className="advantage-card">
              <div className="advantage-number">{index + 1}</div>
              <h3 className="advantage-title">{advantage.title}</h3>
              <p className="advantage-description">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
