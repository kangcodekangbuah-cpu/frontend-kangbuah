import "./ClientExperience.css"

export default function ClientExperience() {
  const clientImages = [
    { src: "src/assets/market.jpg", alt: "Fresh vegetables" },
    { src: "src/assets/packing.jpeg", alt: "Warehouse operations" },
    { src: "src/assets/truk.jpeg", alt: "Delivery truck" },
    { src: "src/assets/sayuran.jpg", alt: "PT Puncak Lembah Hijau" },
    { src: "src/assets/pasar-sayur.jpg", alt: "PT Melati Agro Prima" },
    { src: "src/assets/distro.jpeg", alt: "Distribution center" },
  ]

  return (
    <section className="client-experience">
      <div className="client-background">
        <div className="organic-shape shape-1"></div>
        <div className="organic-shape shape-2"></div>
      </div>

      <div className="client-container">
        <h2 className="client-title">PENGALAMAN KLIEN</h2>

        <div className="client-gallery">
          {clientImages.map((image, index) => (
            <div key={index} className="client-image-card">
              <img src={image.src || "/placeholder.svg"} alt={image.alt} className="client-image" />
              <div className="client-overlay">
                <p className="client-caption">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
