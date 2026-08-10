// StatCard receives props from parent — label, count, icon, color
const StatCard = ({ label, count, icon, color }) => {
    return (
        <div className="metric-card p-4 bg-white border shadow-sm rounded-3 d-flex align-items-center gap-3 h-100">
            <div className={`metric-icon bg-${color} bg-opacity-10 text-${color} rounded-3 p-2 fs-3 d-flex align-items-center justify-content-center`}>
                <i className={`bi ${icon}`}></i>
            </div>
            <div>
                <h3 className="text-muted fs-7 text-uppercase tracking-wider mb-1 fw-semibold">{label}</h3>
                <p className="fs-2 fw-bold mb-0 leading-none" style={{ color: 'var(--ams-navy-900)' }}>{count}</p>
            </div>
        </div>
    )
}

export default StatCard