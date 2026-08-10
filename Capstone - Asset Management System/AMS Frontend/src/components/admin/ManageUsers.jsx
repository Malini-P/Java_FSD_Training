import axios from "axios"
import { useEffect, useState } from "react"

const ManageUsers = () => {

    const getAllUsersApi = "http://localhost:8080/api/users/all"
    const addUserApi = "http://localhost:8080/api/users/add"

    const [users, setUsers] = useState([])

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("EMPLOYEE")

    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()
    const [errMsgUsername, setErrMsgUsername] = useState()
    const [errMsgPassword, setErrMsgPassword] = useState()

    const config_details = {
        headers: {
            'Authorization': "Bearer " + localStorage.getItem('token')
        }
    }

    const loadUsers = async () => {
        try {
            const response = await axios.get(getAllUsersApi, config_details)
            setUsers(response.data)
        }
        catch (err) { }
    }

    useEffect(() => {
        loadUsers()
    }, [])

    const addUser = async (e) => {
        e.preventDefault()
        const body = { username, password, role }
        try {
            await axios.post(addUserApi, body, config_details)
            setSuccessMsg("User added successfully")
            setErrMsg(undefined)
            setErrMsgUsername(undefined)
            setErrMsgPassword(undefined)
            setUsername("")
            setPassword("")
            setRole("EMPLOYEE")
            loadUsers()
        }
        catch (err) {
            setErrMsg("Failed to add user: " + (err.response?.data?.message || ""))
            setErrMsgUsername(err.response?.data?.username || undefined)
            setErrMsgPassword(err.response?.data?.password || undefined)
            setSuccessMsg(undefined)
        }
    }

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return
        try {
            await axios.delete(`http://localhost:8080/api/users/delete/${id}`, config_details)
            // soft-delete from state — same pattern as ManageCategories
            setUsers(users.filter(u => u.id !== id))
        }
        catch (err) {
            alert("Failed to delete user: " + (err.response?.data?.message || ""))
        }
    }

    return (
        <div className="row">
            <div className="col-lg-12">

                {/* Add User Card */}
                <div className="card mb-4">
                    <div className="card-header">
                        Add User
                    </div>
                    <div className="card-body">
                        <form onSubmit={(e) => addUser(e)}>
                            {successMsg !== undefined ?
                                <div className="alert alert-primary mb-4">{successMsg}</div> : ""}
                            {errMsg !== undefined ?
                                <div className="alert alert-danger mb-4">{errMsg}</div> : ""}
                            <div className="mb-4">
                                <label>Username: </label>
                                {errMsgUsername !== undefined ?
                                    <span style={{ color: 'red', fontSize: '11px' }}> {errMsgUsername}</span> : ""}
                                <input type="text" className="form-control" required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label>Password: </label>
                                {errMsgPassword !== undefined ?
                                    <span style={{ color: 'red', fontSize: '11px' }}> {errMsgPassword}</span> : ""}
                                <input type="password" className="form-control" required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label>Role: </label>
                                <select className="form-control"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}>
                                    <option value="EMPLOYEE">EMPLOYEE</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <input type="submit" className="btn btn-secondary" value="Add User" />
                            </div>
                        </form>
                    </div>
                </div>

                {/* All Users Table */}
                <div className="card">
                    <div className="card-header">
                        All Users
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>User ID</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>
                                            <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'} bg-opacity-10 ${user.role === 'ADMIN' ? 'text-danger' : 'text-primary'} border px-2 py-1`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-danger"
                                                onClick={() => deleteUser(user.id)}>
                                                <i className="bi bi-trash me-1"></i>Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 ?
                                    <tr><td colSpan="6" className="text-center text-muted">No users found</td></tr> : ""}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ManageUsers