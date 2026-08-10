import axios from "axios"
import { useEffect, useState } from "react"

const MyServiceRequests = () => {

    const myServiceRequestsApi = "http://localhost:8080/api/service-requests/my"

    const [serviceRequests, setServiceRequests] = useState([])

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        }
    }

    const loadServiceRequests = async () => {
        try {
            const response = await axios.get(myServiceRequestsApi, config_details)
            setServiceRequests(response.data)
        }
        catch (err) { }
    }

    useEffect(() => {
        loadServiceRequests()
    }, [])

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'OPEN': return 'badge-status-open'
            case 'IN_PROGRESS': return 'badge-status-inprogress'
            case 'RESOLVED': return 'badge-status-resolved'
            default: return 'bg-secondary'
        }
    }

    const openCount = serviceRequests.filter(r => r.serviceStatus === 'OPEN').length
    const inProgressCount = serviceRequests.filter(r => r.serviceStatus === 'IN_PROGRESS').length
    const resolvedCount = serviceRequests.filter(r => r.serviceStatus === 'RESOLVED').length

    return (
        <div className="row">
            <div className="col-lg-12">

                {/* Summary strip */}
                <div className="row g-3 mb-3">
                    <div className="col-6 col-md-4">
                        <div className="metric-card p-3 bg-white border shadow-sm rounded-3 d-flex align-items-center gap-3">
                            <div className="metric-icon bg-primary bg-opacity-10 text-primary rounded-3 p-2 fs-4 d-flex align-items-center justify-content-center">
                                <i className="bi bi-tools"></i>
                            </div>
                            <div>
                                <h6 className="text-muted fs-7 text-uppercase mb-1 fw-semibold">Open</h6>
                                <p className="fs-3 fw-bold mb-0">{openCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4">
                        <div className="metric-card p-3 bg-white border shadow-sm rounded-3 d-flex align-items-center gap-3">
                            <div className="metric-icon bg-warning bg-opacity-10 text-warning rounded-3 p-2 fs-4 d-flex align-items-center justify-content-center">
                                <i className="bi bi-arrow-repeat"></i>
                            </div>
                            <div>
                                <h6 className="text-muted fs-7 text-uppercase mb-1 fw-semibold">In Progress</h6>
                                <p className="fs-3 fw-bold mb-0">{inProgressCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4">
                        <div className="metric-card p-3 bg-white border shadow-sm rounded-3 d-flex align-items-center gap-3">
                            <div className="metric-icon bg-success bg-opacity-10 text-success rounded-3 p-2 fs-4 d-flex align-items-center justify-content-center">
                                <i className="bi bi-check2-circle"></i>
                            </div>
                            <div>
                                <h6 className="text-muted fs-7 text-uppercase mb-1 fw-semibold">Resolved</h6>
                                <p className="fs-3 fw-bold mb-0">{resolvedCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header d-flex align-items-center gap-2">
                        <i className="bi bi-wrench-adjustable text-primary"></i>
                        My Service Requests
                    </div>
                    <div className="card-body">
                        {
                            serviceRequests.length === 0 ?
                                <div className="text-center py-5">
                                    <i className="bi bi-tools text-muted" style={{ fontSize: '2.5rem' }}></i>
                                    <p className="text-muted mt-2 mb-0">No service requests found</p>
                                </div>
                                :
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Asset</th>
                                                <th>Issue Description</th>
                                                <th>Status</th>
                                                <th>Created At</th>
                                                <th>Updated At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                serviceRequests.map((req, index) => (
                                                    <tr key={req.serviceRequestId}>
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
                                                        <td className="text-muted">{req.issueDescription}</td>
                                                        <td>
                                                            <span className={`badge ${getStatusBadgeClass(req.serviceStatus)} px-2 py-1`}>
                                                                {req.serviceStatus}
                                                            </span>
                                                        </td>
                                                        <td>{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "-"}</td>
                                                        <td>{req.updatedAt ? new Date(req.updatedAt).toLocaleDateString() : "-"}</td>
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

export default MyServiceRequests