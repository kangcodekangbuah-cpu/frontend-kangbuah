"use client"

import "./StepNavigation.css"

const StepNavigation = ({ currentStep = 1 }) => {
  const steps = [
    { id: 1, name: "KATALOG", active: true },
    { id: 2, name: "FORM PEMESANAN", active: false },
    { id: 3, name: "METODE PEMBAYARAN", active: false },
    { id: 4, name: "INVOICE", active: false },
  ]

  return (
    <div className="step-navigation">
      <div className="container">
        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={step.id} className="step-item">
              <div className={`step-circle ${step.id === currentStep ? "active" : ""}`}>
                <div className="step-dot"></div>
              </div>
              <span className={`step-label ${step.id === currentStep ? "active" : ""}`}>{step.name}</span>
              {index < steps.length - 1 && <div className="step-line"></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StepNavigation
