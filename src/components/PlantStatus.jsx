import React from 'react'

export default function PlantStatus({ moisture }) {
  let text = "Unknown";
  let color = "gray";

  if (moisture < 40) {
    text = "Needs Water";
    color = "text-red-500";
  } else if (moisture > 70) {
    text = "Overwatered";
    color = "text-yellow-500";
  } else {
    text = "Healthy";
    color = "text-green-600";
  }

  return (
    <p className={`text-sm font-medium ${color}`}>
      Status: {text}
    </p>
  )
}
