/* Copyright (c) UWorx Services 2026. All Rights Reserved. The information contained herein is proprietary and confidential. This proprietary and confidential information, either in whole or in part, shall not be used for any purpose unless permitted by the terms of a valid license agreement. */
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
