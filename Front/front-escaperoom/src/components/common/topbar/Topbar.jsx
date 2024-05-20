import React, { useContext } from "react";
import AuthContext from "../../../contexts/AuthContext";
import { RiMenu3Line, RiUser3Line, RiLogoutBoxRLine } from "react-icons/ri";

const Topbar = ({ toggleSidebar }) => {
  const logoPath = "/vite.svg";
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="topbar">
      <div className="logo">
        <img src={logoPath} alt="Logo" />
      </div>

      <div className="options">
        <span className="username">
          Witaj <b>{user?.username}</b>
        </span>
        <RiUser3Line size={24} className="icon-profile" />
        <RiLogoutBoxRLine size={24} className="icon-logout" onClick={logout} />
      </div>
    </nav>
  );
};

export default Topbar;
