import React from 'react'

export default function PlantCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  )
}
