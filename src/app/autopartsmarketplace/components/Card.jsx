export function Card({ children, className = "" }) {
  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>
}

export function CardHeader({ children, className = "" }) {
  return <div className={`p-4 border-b border-slate-700 ${className}`}>{children}</div>
}

export function CardFooter({ children, className = "" }) {
  return <div className={`p-4 border-t border-slate-700 ${className}`}>{children}</div>
}
