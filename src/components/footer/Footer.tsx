import React from "react";

const footerStyles: React.CSSProperties = {
  position: "fixed",
  bottom: "0px",
  width: "100%",
  display: "flex",
  padding: "8px 24px",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "8px",
  // borderTop: "1px solid #D9D9D9",
  background: "#f7faff",
};

function Footer() {
  return (
    <div style={footerStyles}>
      <span style={{ fontSize: 13, color: "gray" }}>
        &copy; 2024-2025 BioBrain | All rights reserved
      </span>
    </div>
  );
}

export default Footer;
