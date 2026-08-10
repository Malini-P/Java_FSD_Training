import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"

const ForgotPassword = () => {

    const forgotPasswordApi = "http://localhost:8080/api/auth/forgot-password"

    const [username, setUsername] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [successMsg, setSuccessMsg] = useState()
    const [errMsg, setErrMsg] = useState()

    const handleSubmit = async (e) => {

        e.preventDefault()

        if (newPassword !== confirmPassword) {
            setErrMsg("Passwords do not match")
            setSuccessMsg(undefined)
            return
        }

        if (newPassword.length < 6) {
            setErrMsg("Password must be at least 6 characters")
            setSuccessMsg(undefined)
            return
        }

        const body = {
            username,
            newPassword
        }

        try {

            await axios.post(forgotPasswordApi, body)

            setSuccessMsg("Password reset successfully")
            setErrMsg(undefined)

            setUsername("")
            setNewPassword("")
            setConfirmPassword("")

        } catch (err) {

            setErrMsg(
                err.response?.data?.message ||
                "Failed to reset password"
            )

            setSuccessMsg(undefined)
        }
    }

    return (
        <div className="auth-shell">
            <div className="auth-form-panel w-100">
                <div className="auth-standalone-card auth-form-card">

                    <div className="d-flex align-items-center gap-2 mb-4">
                        <div className="ams-logo" style={{ background: 'var(--ams-navy-900)' }}>AMS</div>
                        <strong className="fs-6">AMS Console</strong>
                    </div>

                    <h2>Reset your password</h2>
                    <p className="auth-subtitle">Enter your username and choose a new password.</p>

                    <form onSubmit={handleSubmit}>

                        {successMsg &&
                            <div className="alert alert-success d-flex align-items-center gap-2">
                                <i className="bi bi-check-circle"></i>
                                {successMsg}
                            </div>
                        }

                        {errMsg &&
                            <div className="alert alert-danger d-flex align-items-center gap-2">
                                <i className="bi bi-exclamation-circle"></i>
                                {errMsg}
                            </div>
                        }

                        <div className="mb-3">
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label>New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter a new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Re-enter the new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 mb-3">
                            Reset Password
                        </button>

                        <div className="text-center">
                            <Link to="/login" className="small">
                                <i className="bi bi-arrow-left me-1"></i>Back to Sign In
                            </Link>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    )
}

export default ForgotPassword