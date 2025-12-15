import "./ClientExperience.css"
import marketImg from "../../../assets/market.jpg"
import packingImg from "../../../assets/packing.jpeg"
import trukImg from "../../../assets/truk.jpeg"
import sayuranImg from "../../../assets/sayuran.jpg"
import pasarImg from "../../../assets/pasar-sayur.jpg"
import distroImg from "../../../assets/distro.jpeg"

export default function ClientExperience() {
  const clientImages = [
    { src: marketImg, alt: "Fresh vegetables" },
    { src: packingImg, alt: "Warehouse operations" },
    { src: trukImg, alt: "Delivery truck" },
    { src: sayuranImg, alt: "PT Puncak Lembah Hijau" },
    { src: pasarImg, alt: "PT Melati Agro Prima" },
    { src: distroImg, alt: "Distribution center" },
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
