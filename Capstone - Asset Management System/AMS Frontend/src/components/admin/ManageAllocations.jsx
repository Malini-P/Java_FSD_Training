import axios from "axios"
import { useEffect, useState } from "react"

const ManageAllocations = () => {

    const getAllAllocationsApi = "http://localhost:8080/api/asset-allocations/all"

    const [allocations, setAllocations] = useState([])

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        }
    }

    const loadAllocations = async () => {
        try {
            const response = await axios.get(getAllAllocationsApi, config_details)
            setAllocations(response.data)
        }
        catch (err) { }
    }

    useEffect(() => {
        loadAllocations()
    }, [])

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-header">
                        All Asset Allocations
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Allocation ID</th>
                                    <th>Employee</th>
                                    <th>Asset</th>
                                    <th>Model</th>
                                    <th>Allocated At</th>
                                    <th>Status</th>
                                    <th>Returned At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    allocations.map((alloc, index) => (
                                        <tr key={alloc.allocationId}>
                                            <td>{index + 1}</td>
                                            <td>{alloc.allocationId}</td>
                                            <td>{alloc.employeeUsername}</td>
                                            <td>{alloc.assetName}</td>
                                            <td>{alloc.assetModel || "-"}</td>
                                            <td>{alloc.allocatedAt ? new Date(alloc.allocatedAt).toLocaleDateString() : "-"}</td>
                                            <td>
                                                {
                                                    alloc.returned ?
                                                        <span className="badge badge-status-resolved px-2 py-1">Returned</span> :
                                                        <span className="badge badge-status-allocated px-2 py-1">Active</span>
                                                }
                                            </td>
                                            <td>{alloc.returnedAt ? new Date(alloc.returnedAt).toLocaleDateString() : "-"}</td>
                                        </tr>
                                    ))
                                }
                                {
                                    allocations.length === 0 ?
                                        <tr><td colSpan="8" className="text-center text-muted">No allocations found</td></tr> : ""
                                }
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageAllocations