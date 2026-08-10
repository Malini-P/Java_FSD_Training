import axios from "axios"
import { useEffect, useState } from "react"

const ManageCategories = () => {

    const allWithCountApi = "http://localhost:8080/api/v2/categories/all-with-count"
    const addCategoryApi = "http://localhost:8080/api/categories/add"

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    // Add form state
    const [categoryName, setCategoryName] = useState("")
    const [description, setDescription] = useState("")
    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()

    // Edit state
    const [editId, setEditId] = useState(null)
    const [editCategoryName, setEditCategoryName] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [editSuccessMsg, setEditSuccessMsg] = useState()
    const [editErrMsg, setEditErrMsg] = useState()

    // Search
    const [search, setSearch] = useState("")

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        }
    }

    const loadCategories = async () => {
        try {
            const response = await axios.get(allWithCountApi, config_details)
            setCategories(response.data)
        }
        catch (err) { }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCategories()
    }, [])

    const filtered = categories.filter(cat =>
        cat.categoryName?.toLowerCase().includes(search.toLowerCase()) ||
        cat.description?.toLowerCase().includes(search.toLowerCase())
    )

    const totalAssets = categories.reduce((sum, cat) => sum + (cat.assetCount || 0), 0)

    const addCategory = async (e) => {
        e.preventDefault()
        const body = { categoryName, description }
        try {
            const response = await axios.post(addCategoryApi, body, config_details)
            setSuccessMsg("Category added successfully")
            setErrMsg(undefined)
            setCategoryName("")
            setDescription("")
            setCategories([...categories, { ...response.data, assetCount: 0 }])
            document.getElementById('closeAddModal').click()
        }
        catch (err) {
            setErrMsg("Failed to add category: " + (err.response?.data?.message || ""))
            setSuccessMsg(undefined)
        }
    }

    const openEdit = (cat) => {
        setEditId(cat.id)
        setEditCategoryName(cat.categoryName)
        setEditDescription(cat.description || "")
        setEditSuccessMsg(undefined)
        setEditErrMsg(undefined)
    }

    const saveEdit = async (e) => {
        e.preventDefault()
        const body = { categoryName: editCategoryName, description: editDescription }
        try {
            const response = await axios.put(`http://localhost:8080/api/categories/update/${editId}`, body, config_details)
            setEditSuccessMsg("Category updated successfully")
            setEditErrMsg(undefined)
            let tempArry = [...categories].map(c => c.id === editId ? { ...c, ...response.data } : c)
            setCategories([...tempArry])
        }
        catch (err) {
            setEditErrMsg("Update failed: " + (err.response?.data?.message || ""))
            setEditSuccessMsg(undefined)
        }
    }

    const deleteCategory = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return
        try {
            await axios.delete(`http://localhost:8080/api/categories/delete/${id}`, config_details)
            let tempArry = [...categories].filter(c => c.id !== id)
            setCategories([...tempArry])
        }
        catch (err) {
            alert("Delete failed: " + (err.response?.data?.message || ""))
        }
    }

    return (
        <div className="row">
            <div className="col-lg-12">

                {successMsg !== undefined ?
                    <div className="alert alert-primary mb-4">{successMsg}</div> : ""}

                {/* Summary Stat Strip */}
                <div className="row mb-4 g-3">
                    <div className="col-md-4">
                        <div className="card metric-card h-100">
                            <div className="card-body d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-muted small">Total Categories</div>
                                    <div className="fs-3 fw-semibold">{categories.length}</div>
                                </div>
                                <i className="bi bi-tag fs-2 text-primary opacity-75"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                       <div className="card metric-card h-100">
                            <div className="card-body d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-muted small">Total Assets Tracked</div>
                                    <div className="fs-3 fw-semibold">{totalAssets}</div>
                                </div>
                                <i className="bi bi-boxes fs-2 text-success opacity-75"></i>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card metric-card h-100">
                            <div className="card-body d-flex align-items-center justify-content-between">
                                <div>
                                    <div className="text-muted small">Empty Categories</div>
                                    <div className="fs-3 fw-semibold">{categories.filter(c => !c.assetCount).length}</div>
                                </div>
                                <i className="bi bi-inbox fs-2 text-secondary opacity-75"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {editId !== null ?
                    <div className="card mb-4">
                        <div className="card-header">Edit Category</div>
                        <div className="card-body">
                            <form onSubmit={(e) => saveEdit(e)}>
                                {editSuccessMsg !== undefined ?
                                    <div className="alert alert-primary mb-4">{editSuccessMsg}</div> : ""}
                                {editErrMsg !== undefined ?
                                    <div className="alert alert-danger mb-4">{editErrMsg}</div> : ""}
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <label>Category Name: </label>
                                        <input type="text" className="form-control" required
                                            value={editCategoryName}
                                            onChange={(e) => setEditCategoryName(e.target.value)} />
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label>Description: </label>
                                        <input type="text" className="form-control"
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)} />
                                    </div>
                                </div>
                                <div className="mb-2 d-flex gap-2">
                                    <input type="submit" className="btn btn-primary" value="Save Changes" />
                                    <button type="button" className="btn btn-outline-secondary"
                                        onClick={() => setEditId(null)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div> : ""}

              {/* All Categories */}
<div className="card">
    <div className="card-header d-flex align-items-center">
        <span className="fw-semibold ms-2">
            All Categories
        </span>

        <div className="ms-auto d-flex gap-2">
            <button
                className="btn btn-sm btn-outline-secondary"
                onClick={loadCategories}
            >
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
            </button>

            <button
                className="btn btn-primary btn-sm"
                data-bs-toggle="modal"
                data-bs-target="#addCategoryModal"
            >
                <i className="bi bi-plus-lg me-1"></i>
                Add Category
            </button>
        </div>
    </div>
                    <div className="card-body">

                        {/* Search */}
                        <div className="d-flex align-items-center gap-3 flex-wrap mb-3 p-2 bg-light rounded-3">
                            <input type="text" className="form-control" style={{ maxWidth: 280, fontSize: '0.83rem' }}
                                placeholder="Search by name or description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)} />
                            {search && (
                                <span className="text-muted" style={{ fontSize: '0.83rem' }}>
                                    {filtered.length} of {categories.length} categories
                                </span>
                            )}
                        </div>

                        <div className="table-responsive">
                            <table className="table table-bordered table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Category Name</th>
                                        <th>Description</th>
                                        <th className="text-center">Assets</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && (
                                        <tr><td colSpan="5" className="text-center text-muted py-4">Loading categories...</td></tr>
                                    )}
                                    {!loading && filtered.map((cat, index) => (
                                        <tr key={cat.id}>
                                            <td>{index + 1}</td>
                                            <td className="fw-medium">{cat.categoryName}</td>
                                            <td className="text-muted">{cat.description || "-"}</td>
                                            <td className="text-center">
                                                <span className={`badge ${cat.assetCount ? "bg-primary" : "bg-secondary"} px-2 py-1`}>
                                                    {cat.assetCount ?? 0}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => openEdit(cat)}>
                                                    <i className="bi bi-pencil-square me-1"></i>Edit
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger"
                                                    onClick={() => deleteCategory(cat.id)}>
                                                    <i className="bi bi-trash me-1"></i>Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {!loading && filtered.length === 0 &&
                                        <tr><td colSpan="5" className="text-center text-muted py-4">No categories found</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bootstrap Modal — Add Category */}
            <div className="modal fade" id="addCategoryModal" tabIndex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addCategoryModalLabel">Add Category</h5>
                            <button type="button" className="btn-close" id="closeAddModal" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={(e) => addCategory(e)}>
                            <div className="modal-body">
                                {errMsg !== undefined ?
                                    <div className="alert alert-danger mb-3">{errMsg}</div> : ""}
                                <div className="mb-3">
                                    <label>Category Name: </label>
                                    <input type="text" className="form-control" required
                                        value={categoryName}
                                        onChange={(e) => setCategoryName(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label>Description: </label>
                                    <input type="text" className="form-control"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <input type="submit" className="btn btn-primary" value="Add Category" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageCategories