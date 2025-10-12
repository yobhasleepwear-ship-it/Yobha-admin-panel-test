import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer
      style={{
        width: "100%",
        padding: "30px 20px",
        backgroundColor: "#ffffff", // pure white background
        color: "#b76e79", // rose-gold text
        fontFamily: "Poppins, sans-serif",
        textAlign: "center",
        position: "relative",
        bottom: 0,
        left: 0,
        zIndex: 10,
        borderTop: "1px solid rgba(183, 110, 121, 0.3)", // soft rose-gold line
        boxShadow: "0 -2px 15px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          gap: "20px",
        }}
      >
        {/* Left Section */}
        <div style={{ flex: "1 1 300px", textAlign: "left", fontWeight: 500 }}>
          © 2025{" "}
          <span style={{ fontWeight: "600", color: "#d4af37" }}>YOBHA</span>. All rights reserved.
        </div>

        {/* Center Section */}
        <div
          style={{
            flex: "1 1 300px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <a href="/privacyPolicy.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            Privacy Policy
          </a>
          <a href="/termsandconditions.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            Terms & Conditions
          </a>
          <a href="/returnPolicy.pdf" target="_blank" rel="noopener noreferrer" style={linkStyle}>
            Return Policy
          </a>
        </div>

        {/* Right Section */}
        <div
          style={{
            flex: "1 1 300px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "15px",
          }}
        >
          <a href="#" style={iconStyle}><FaFacebookF /></a>
          <a href="#" style={iconStyle}><FaTwitter /></a>
          <a href="#" style={iconStyle}><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
};

// Link + Icon hover styles
const linkStyle = {
  color: "#b76e79", // rose-gold
  fontWeight: 500,
  textDecoration: "none",
  transition: "all 0.3s ease",
};
const iconStyle = {
  color: "#d4af37", // gold
  fontSize: "1.3rem",
  transition: "transform 0.3s ease, color 0.3s ease",
  cursor: "pointer",
};

export default Footer;
