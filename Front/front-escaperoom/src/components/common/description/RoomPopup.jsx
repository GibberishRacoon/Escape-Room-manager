const RoomPopup = ({ room, onClose }) => {
  if (!room) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>{room.nazwa}</h3>
        <p>Ilość miejsc: {room.pojemność}</p>
        <p>Dostępność: {room.dostępny ? "Dostępny" : "Niedostępny"}</p>
        <p>Opis: {room.opis}</p>
        <button onClick={onClose} className="button button-gradient">
          Zamknij
        </button>
      </div>
    </div>
  );
};

export default RoomPopup;
