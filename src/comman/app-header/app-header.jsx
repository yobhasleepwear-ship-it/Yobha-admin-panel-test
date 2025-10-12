import React from "react";

const Header = () => {
  return (
    <header style={{
      width: "100%",
      padding: "20px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 2,
    }}>
      <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#fff" }}>
       YOBHA
      </div>
      <nav style={{ display: "flex", gap: "20px" }}>
        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Home</a>
        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>About</a>
        <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Contact</a>
      </nav>
    </header>
  );
};

export default Header;
