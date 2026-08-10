// Shows asset status breakdown (Available / Allocated / Under Service)
// as horizontal progress bars instead of separate stat cards.
const AssetStatusProgress = ({ stats }) => {

    const total = stats ? stats.totalAssets : 0
    const available = stats ? stats.availableAssets : 0
    const allocated = stats ? stats.allocatedAssets : 0
    const underService = stats ? stats.assetsUnderService : 0

    const pct = (value) => total > 0 ? Math.round((value / total) * 100) : 0

    const rows = [
        { label: "Available", value: available, color: "success" },
        { label: "Allocated", value: allocated, color: "primary" },
        { label: "Under Service", value: underService, color: "warning" }
    ]

    return (
        <div className="data-box border shadow-sm rounded-3 p-4">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                <h4 className="fs-6 fw-bold mb-0">Asset Status Breakdown</h4>
                <span className="fs-7 text-muted fw-medium">Total: {total}</span>
            </div>

            <div className="d-flex flex-column gap-3">
                {
                    rows.map((row) => (
                        <div key={row.label}>
                            <div className="d-flex justify-content-between mb-1">
                                <span className="fs-7 fw-semibold text-muted">{row.label}</span>
                                <span className="fs-7 fw-semibold">{row.value} <span className="text-muted">({pct(row.value)}%)</span></span>
                            </div>
                            <div className="progress" style={{ height: '10px' }}>
                                <div
                                    className={`progress-bar bg-${row.color}`}
                                    role="progressbar"
                                    style={{ width: pct(row.value) + '%' }}
                                    aria-valuenow={pct(row.value)}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                        </div>
                    ))
                }
            </div>

            <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                <div className="text-center flex-fill">
                    <div className="fs-4 fw-bold" style={{ color: 'var(--ams-navy-900)' }}>{stats ? stats.totalUsers : 0}</div>
                    <div className="fs-7 text-muted">Total Users</div>
                </div>
                <div className="text-center flex-fill">
                    <div className="fs-4 fw-bold" style={{ color: 'var(--ams-navy-900)' }}>{stats ? stats.pendingRequests : 0}</div>
                    <div className="fs-7 text-muted">Pending Requests</div>
                </div>
                <div className="text-center flex-fill">
                    <div className="fs-4 fw-bold" style={{ color: 'var(--ams-navy-900)' }}>{stats ? stats.openServiceRequests : 0}</div>
                    <div className="fs-7 text-muted">Open Service Req.</div>
                </div>
            </div>
        </div>
    )
}

export default AssetStatusProgress