import "./ClientExperience.css"

export default function ClientExperience() {
  const clientImages = [
    { src: "/fresh-vegetables-delivery.jpg", alt: "Fresh vegetables" },
    { src: "/produce-warehouse.jpg", alt: "Warehouse operations" },
    { src: "/delivery-truck-vegetables.jpg", alt: "Delivery truck" },
    { src: "/pt-puncak-lembah-hijau-client.jpg", alt: "PT Puncak Lembah Hijau" },
    { src: "/pt-melati-agro-prima-client.jpg", alt: "PT Melati Agro Prima" },
    { src: "/vegetable-distribution.jpg", alt: "Distribution center" },
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
