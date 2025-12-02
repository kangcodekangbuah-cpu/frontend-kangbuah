import "./Services.css"

export default function Services() {
  const services = [
    {
      title: "Pengadaan Rutin Untuk Restoran, Hotel, Rumah Sakit, Pabrik",
      icon: "📦",
      description: "Layanan pengadaan rutin untuk kebutuhan bisnis Anda",
    },
    {
      title: "Pengiriman Langsung Area Jabodetabek",
      icon: "🚚",
      description: "Pengiriman cepat dan terpercaya di area Jabodetabek",
    },
    {
      title: "Sistem Pemesanan Fleksibel Melalui WA",
      icon: "📱",
      description: "Pemesanan mudah melalui WhatsApp dengan sistem yang fleksibel",
    },
    {
      title: "Layanan Konsultasi Kebutuhan Pasokan Harian/Bulanan",
      icon: "💼",
      description: "Konsultasi profesional untuk kebutuhan pasokan bisnis Anda",
    },
  ]

  return (
    <section className="services" id="service">
      <div className="services-background">
        <div className="organic-shape shape-1"></div>
        <div className="organic-shape shape-2"></div>
        <div className="organic-shape shape-3"></div>
      </div>

      <div className="services-container">
        <h2 className="services-title">PRODUK DAN LAYANAN</h2>

        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
