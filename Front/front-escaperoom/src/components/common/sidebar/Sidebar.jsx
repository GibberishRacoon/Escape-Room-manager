import React from "react";

const Sidebar = ({ isVisible, toggleRoomSearch }) => {
  return (
    <aside className={`sidebar ${isVisible ? "visible" : ""}`}>
      {/* ... inne elementy Sidebar */}
      <button className="sidebar-option" onClick={toggleRoomSearch}>
        Pokaż/ukryj RoomSearch na Dashboard
      </button>
      {/* ... reszta kodu sidebar */}
    </aside>
  );
};

export default Sidebar;
