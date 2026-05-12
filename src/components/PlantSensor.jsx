import React from 'react'

export default function PlantSensor({ label, value, unit }) {
  return (
    <div className="bg-gray-100 p-3 rounded-lg text-center">
      <p className="text-gray-500">{label}</p>
      <p className="font-bold">
        {value ? value.toFixed(1) : "--"} {unit}
      </p>
    </div>
  )
}
