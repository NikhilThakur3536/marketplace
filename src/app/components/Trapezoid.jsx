export const Trapezoid = () => {
  return (
    <svg width="300" height="100" viewBox="0 0 300 100">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#FF5733', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FF8C66', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M20,90 Q10,90 10,80 L10,20 Q10,10 20,10 L280,10 Q290,10 290,20 L290,80 Q290,90 280,90 Z"
        fill="url(#gradient)"
      />
    </svg>
  )
}
