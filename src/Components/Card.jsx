import React from 'react'

const CardItem = ({ bgImage, icon, title }) => {
  return (
    <div className="col-4 mb-2">
    <div className="section p-0">
      <div className="ard text-white">
        <img src={bgImage} className="card-img" alt="background" />
        <div className="card-img-overlay d-flex flex-column align-items-center justify-content-center p-0">
          <img src={icon} alt={title} className="w-50" />
          <h5 className="fs-7 text-center text-dark mt-1 fw-bold">{title}</h5>
        </div>
      </div>
    </div>
  </div>
  )
}

export default CardItem