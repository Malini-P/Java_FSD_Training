import axios from "axios"
import { useEffect, useState } from "react"

const MyAllocations = () => {

    const myAllocationsApi = "http://localhost:8080/api/asset-allocations/my"

    const [allocations, setAllocations] = useState([])
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        }
    }

    const loadAllocations = async () => {
        try {
            const response = await axios.get(myAllocationsApi, config_details)
            setAllocations(response.data)
        }
        catch (err) { }
    }

    useEffect(() => {
        loadAllocations()
    }, [])

    const returnAsset = async (allocationId) => {
        if (!window.confirm("Are you sure you want to return this asset?")) return
        try {
            await axios.put(`http://localhost:8080/api/asset-allocations/${allocationId}/return`, {}, config_details)
            setSuccessMsg("Asset returned successfully")
            setErrMsg(undefined)
            loadAllocations()
        }
        catch (err) {
            setErrMsg("Return failed: " + (err.response?.data?.message || ""))
            setSuccessMsg(undefined)
        }
    }

    const activeCount = allocations.filter(a => !a.returned).length
    const returnedCount = allocations.filter(a => a.returned).length

    return (
        <div className="row">
            <div className="col-lg-12">

                {/* Summary strip */}
                <div className="row g-3 mb-3">
                    <div className="col-6 col-md-4">
                        <div className="metric-card p-3 bg-white border shadow-sm rounded-3 d-flex align-items-center gap-3">
                            <div className="metric-icon bg-primary bg-opacity-10 text-primary rounded-3 p-2 fs-4 d-flex align-items-center justify-content-center">
                                <i className="bi bi-laptop-fill"></i>
                            </div>
                            <div>
                                <h6 className="text-muted fs-7 text-uppercase mb-1 fw-semibold">Currently With You</h6>
                                <p className="fs-3 fw-bold mb-0">{activeCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-4">
                        <div className="metric-card p-3 bg-white border shadow-sm rounded-3 d-flex align-items-center gap-3">
                            <div className="metric-icon bg-success bg-opacity-10 text-success rounded-3 p-2 fs-4 d-flex align-items-center justify-content-center">
                                <i className="bi bi-check2-circle"></i>
                            </div>
                            <div>
                                <h6 className="text-muted fs-7 text-uppercase mb-1 fw-semibold">Returned</h6>
                                <p className="fs-3 fw-bold mb-0">{returnedCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header d-flex align-items-center gap-2">
                        <i className="bi bi-laptop text-primary"></i>
                        My Allocations
                    </div>
                    <div className="card-body">
                        {
                            successMsg !== undefined ?
                                <div className="alert alert-primary mb-4">{successMsg}</div> : ""
                        }
                        {
                            errMsg !== undefined ?
                                <div className="alert alert-danger mb-4">{errMsg}</div> : ""
                        }

                        {
                            allocations.length === 0 ?
                                <div className="text-center py-5">
                                    <i className="bi bi-inbox text-muted" style={{ fontSize: '2.5rem' }}></i>
                                    <p className="text-muted mt-2 mb-0">No assets allocated to you yet</p>
                                </div>
                                :
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Asset</th>
                                                <th>Model</th>
                                                <th>Allocated At</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                allocations.map((alloc, index) => (
                                                    <tr key={alloc.allocationId}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <div className="metric-icon bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center"
                                                                    style={{ width: 36, height: 36, fontSize: '1rem' }}>
                                                                    <i className="bi bi-laptop-fill"></i>
                                                                </div>
                                                                <span className="fw-semibold">{alloc.assetName}</span>
                                                            </div>
                                                        </td>
                                                        <td>{alloc.assetModel || "-"}</td>
                                                        <td>{alloc.allocatedAt ? new Date(alloc.allocatedAt).toLocaleDateString() : "-"}</td>
                                                        <td>
                                                            {
                                                                alloc.returned ?
                                                                    <span className="badge badge-status-resolved px-2 py-1">Returned</span> :
                                                                    <span className="badge badge-status-allocated px-2 py-1">Active</span>
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                !alloc.returned ?
                                                                    <button className="btn btn-sm btn-outline-warning"
                                                                        onClick={() => returnAsset(alloc.allocationId)}>
                                                                        <i className="bi bi-box-arrow-left me-1"></i>Return
                                                                    </button> :
                                                                    <span className="text-muted fs-7">
                                                                        Returned on {alloc.returnedAt ? new Date(alloc.returnedAt).toLocaleDateString() : "-"}
                                                                    </span>
                                                            }
                                                        </td>
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

export default MyAllocations