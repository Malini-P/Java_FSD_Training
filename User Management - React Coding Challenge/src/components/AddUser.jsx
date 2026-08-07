import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../store/action/userAction";

const AddUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");

    const saveUser = (e) => {
        e.preventDefault();
        const body = {
            id: Date.now(),
            name,
            email,
            phone,
            company: { name: company }
        };
        dispatch(addUser(body));
        alert("User Added Successfully");
        navigate("/users");
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Add User</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={saveUser}>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-control" value={name}
                                        onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" value={email}
                                        onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Phone</label>
                                    <input type="text" className="form-control" value={phone}
                                        onChange={(e) => setPhone(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Company Name</label>
                                    <input type="text" className="form-control" value={company}
                                        onChange={(e) => setCompany(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn btn-success me-2">Save User</button>
                                <button type="button" className="btn btn-secondary" onClick={() => navigate("/users")}>
                                    Back
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddUser