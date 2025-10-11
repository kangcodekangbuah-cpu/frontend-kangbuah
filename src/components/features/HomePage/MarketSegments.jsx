import "./MarketSegments.css"

export default function MarketSegments() {
  const segments = [
    {
      title: "Restoran dan Café",
      icon: "🍽️",
      description: "Melayani kebutuhan bahan segar untuk restoran dan café",
    },
    {
      title: "Hotel",
      icon: "🏨",
      description: "Pasokan berkualitas untuk industri perhotelan",
    },
    {
      title: "Layanan Catering",
      icon: "👨‍🍳",
      description: "Mendukung bisnis catering dengan produk segar",
    },
    {
      title: "Rumah Sakit",
      icon: "🏥",
      description: "Menyediakan bahan makanan sehat untuk rumah sakit",
    },
    {
      title: "Pabrik dengan Kebutuhan Dapur",
      icon: "🏭",
      description: "Melayani kebutuhan dapur industri dan pabrik",
    },
  ]

  return (
    <section className="market-segments">
      <div className="segments-background">
        <div className="organic-shape shape-1"></div>
        <div className="organic-shape shape-2"></div>
        <div className="organic-shape shape-3"></div>
      </div>

      <div className="segments-container">
        <h2 className="segments-title">SEGMEN PASAR KAMI</h2>

        <div className="segments-grid">
          {segments.map((segment, index) => (
            <div key={index} className="segment-card">
              <div className="segment-icon">{segment.icon}</div>
              <h3 className="segment-title">{segment.title}</h3>
              <p className="segment-description">{segment.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
