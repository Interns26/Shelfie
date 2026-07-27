function GradientButton({ children, className = '', ...props }) {
  return (
    <button
      className={`btn-glow ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

export default GradientButton;
