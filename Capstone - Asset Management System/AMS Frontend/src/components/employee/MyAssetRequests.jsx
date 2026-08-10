import axios from "axios"
import { useEffect, useState } from "react"

const MyAssetRequests = () => {

    const myRequestsApi = "http://localhost:8080/api/asset-requests/my"

    const [requests, setRequests] = useState([])

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        }
    }

    const loadRequests = async () => {
        try {
            const response = await axios.get(myRequestsApi, config_details)
            setRequests(response.data)
        }
        catch (err) { }
    }

    useEffect(() => {
        loadRequests()
    }, [])

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'PENDING': return 'badge-status-pending'
            case 'APPROVED': return 'badge-status-approved'
            case 'REJECTED': return 'badge-status-rejected'
            default: return 'bg-secondary'
        }
    }

    const pendingCount = requests.filter(r => r.requestStatus === 'PENDING').length
    const approvedCount = requests.filter(r => r.requestStatus === 'APPROVED').length
    const rejectedCount = requests.filter(r => r.requestStatus === 'REJECTED').length

    return (
        <div className="row">
            <div className="col-lg-12">

                {/* Summary strip */}
                <div className="row g-3 mb-3">
                    <div className="col-6 col-md-4">
                        <div className="metric-card p-3 bg-white border shadow-sm rounded-3 d-flex align-items-center gap-3">
                            <div className="metric-icon bg-warning bg-opacity-10 text-warning rounded-3 p-2 fs-4 d-flex align-items-center justify-content-center">
                                <i className="bi bi-hourglass-split"></i>
                            </div>
                            <div>
                                <h6 className="text-muted fs-7 text-uppercase mb-1 fw-semibold">Pending</h6>
                                <p className="fs-3 fw-bold mb-0">{pendingCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4">
                        <div className="metric-card p-3 bg-white border shadow-sm rounded-3 d-flex align-items-center gap-3">
                            <div className="metric-icon bg-success bg-opacity-10 text-success rounded-3 p-2 fs-4 d-flex align-items-center justify-content-center">
                                <i className="bi bi-check-circle"></i>
                            </div>
                            <div>
                                <h6 className="text-muted fs-7 text-uppercase mb-1 fw-semibold">Approved</h6>
                                <p className="fs-3 fw-bold mb-0">{approvedCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4">
                        <div className="metric-card p-3 bg-white border shadow-sm rounded-3 d-flex align-items-center gap-3">
                            <div className="metric-icon bg-danger bg-opacity-10 text-danger rounded-3 p-2 fs-4 d-flex align-items-center justify-content-center">
                                <i className="bi bi-x-circle"></i>
                            </div>
                            <div>
                                <h6 className="text-muted fs-7 text-uppercase mb-1 fw-semibold">Rejected</h6>
                                <p className="fs-3 fw-bold mb-0">{rejectedCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header d-flex align-items-center gap-2">
                        <i className="bi bi-clipboard2-check text-primary"></i>
                        My Asset Requests
                    </div>
                    <div className="card-body">
                        {
                            requests.length === 0 ?
                                <div className="text-center py-5">
                                    <i className="bi bi-inbox text-muted" style={{ fontSize: '2.5rem' }}></i>
                                    <p className="text-muted mt-2 mb-0">No requests found</p>
                                </div>
                                :
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Asset</th>
                                                <th>Reason</th>
                                                <th>Status</th>
                                                <th>Created At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                requests.map((req, index) => (
                                                    <tr key={req.requestId}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div className="metric-icon bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center"
                                                                    style={{ width: 36, height: 36, fontSize: '1rem' }}>
                                                                    <i className="bi bi-laptop-fill"></i>
                                                                </div>
                                                                <span className="fw-semibold">{req.assetName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="text-muted">{req.reason}</td>
                                                        <td>
                                                            <span className={`badge ${getStatusBadgeClass(req.requestStatus)} px-2 py-1`}>
                                                                {req.requestStatus}
                                                            </span>
                                                        </td>
                                                        <td>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "-"}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyAssetRequests