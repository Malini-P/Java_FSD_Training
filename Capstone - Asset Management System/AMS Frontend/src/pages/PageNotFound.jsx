import { Link } from "react-router-dom"

const PageNotFound = () => {
    return (
        <div className="auth-shell">
            <div className="auth-form-panel w-100">
                <div className="auth-standalone-card text-center" style={{ maxWidth: 420 }}>
                    <div className="ams-logo mx-auto mb-4" style={{ background: 'var(--ams-navy-900)' }}>AMS</div>
                    <h1 className="fw-bold mb-1" style={{ fontSize: '3rem', color: 'var(--ams-navy-900)' }}>404</h1>
                    <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
                    <Link to="/login" className="btn btn-primary">
                        <i className="bi bi-arrow-left me-1"></i>Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PageNotFound