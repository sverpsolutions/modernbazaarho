interface page_header_props {
  title: string
  subtitle?: string
  icon?: string
  action?: React.ReactNode
}

export default function PageHeader({ title, subtitle, icon, action }: page_header_props) {
  return (
    <div className="page-header">
      <div>
        <div className="flex items-center gap-2">
          {icon && <i className={`fas ${icon} text-blue-600`}></i>}
          <h1 className="page-title">{title}</h1>
        </div>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
