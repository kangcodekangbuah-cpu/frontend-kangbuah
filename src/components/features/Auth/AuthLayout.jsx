const AuthLayout = ({ children }) => {
  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="organic-shape shape-1"></div>
        <div className="organic-shape shape-2"></div>
        <div className="organic-shape shape-3"></div>
        <div className="organic-shape shape-4"></div>
      </div>
      <div className="auth-content">
        <div className="auth-form-container">
          {children}
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;