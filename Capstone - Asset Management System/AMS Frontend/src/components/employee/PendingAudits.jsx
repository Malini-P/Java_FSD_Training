import axios from "axios"
import { useEffect, useState } from "react"

const PendingAudits = () => {

    const getMyAuditsApi = "http://localhost:8080/api/audits/my"

    const [audits, setAudits] = useState([])
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        }
    }

    const loadMyAudits = async () => {
        try {
            const response = await axios.get(getMyAuditsApi, config_details)
            setAudits(response.data)
        }
        catch (err) { }
    }

    useEffect(() => {
        loadMyAudits()
    }, [])

    const verifyAudit = async (id) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/audits/${id}/verify`, {}, config_details)
            setSuccessMsg("Asset verified successfully")
            setErrMsg(undefined)
            setAudits(audits.map(a => a.id === id ? response.data : a))
        }
        catch (err) {
            setErrMsg("Failed to verify: " + (err.response?.data?.message || ""))
            setSuccessMsg(undefined)
        }
    }

    const rejectAudit = async (id) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/audits/${id}/reject`, {}, config_details)
            setSuccessMsg("Audit marked as rejected")
            setErrMsg(undefined)
            setAudits(audits.map(a => a.id === id ? response.data : a))
        }
        catch (err) {
            setErrMsg("Failed to reject: " + (err.response?.data?.message || ""))
            setSuccessMsg(undefined)
        }
    }

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-warning bg-opacity-10 text-warning border border-warning'
            case 'VERIFIED': return 'bg-success bg-opacity-10 text-success border border-success'
            case 'REJECTED': return 'bg-danger bg-opacity-10 text-danger border border-danger'
            default: return 'bg-secondary'
        }
    }

    const pendingCount = audits.filter(a => a.status === 'PENDING').length
    const verifiedCount = audits.filter(a => a.status === 'VERIFIED').length
    const rejectedCount = audits.filter(a => a.status === 'REJECTED').length

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
                                <h6 className="text-muted fs-7 text-uppercase mb-1 fw-semibold">Verified</h6>
                                <p className="fs-3 fw-bold mb-0">{verifiedCount}</p>
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
                        <i className="bi bi-search text-primary"></i>
                        <span>My Asset Audits</span>
                        {pendingCount > 0 &&
                            <span className="badge bg-warning text-dark ms-1">
                                {pendingCount} pending
                            </span>
                        }
                    </div>
                    <div className="card-body">

                        {successMsg !== undefined ?
                            <div className="alert alert-primary mb-4">{successMsg}</div> : ""}
                        {errMsg !== undefined ?
                            <div className="alert alert-danger mb-4">{errMsg}</div> : ""}

                        {
                            audits.length === 0 ?
                                <div className="text-center py-5">
                                    <i className="bi bi-clipboard-check text-muted" style={{ fontSize: '2.5rem' }}></i>
                                    <p className="text-muted mt-2 mb-0">No audit requests found</p>
                                </div>
                                :
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Asset Name</th>
                                                <th>Asset Model</th>
                                                <th>Status</th>
                                                <th>Sent At</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {audits.map((audit, index) => (
                                                <tr key={audit.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="metric-icon bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center"
                                                                style={{ width: 36, height: 36, fontSize: '1rem' }}>
                                                                <i className="bi bi-laptop-fill"></i>
                                                            </div>
                                                            <span className="fw-semibold">{audit.assetName}</span>
                                                        </div>
                                                    </td>
                                                    <td>{audit.assetModel || "-"}</td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadgeClass(audit.status)} px-2 py-1`}>
                                                            {audit.status}
                                                        </span>
                                                    </td>
                                                    <td>{audit.sentAt ? new Date(audit.sentAt).toLocaleDateString() : "-"}</td>
                                                    <td>
                                                        {audit.status === 'PENDING' ? (
                                                            <div className="d-flex gap-2">
                                                                <button className="btn btn-sm btn-outline-success"
                                                                    onClick={() => verifyAudit(audit.id)}>
                                                                    <i className="bi bi-check-circle me-1"></i>Verify
                                                                </button>
                                                                <button className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => rejectAudit(audit.id)}>
                                                                    <i className="bi bi-x-circle me-1"></i>Reject
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted fs-7">
                                                                {audit.status === 'VERIFIED' ? 'Verified' : 'Rejected'} on{' '}
                                                                {audit.verifiedAt ? new Date(audit.verifiedAt).toLocaleDateString() : "-"}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
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

export default PendingAudits