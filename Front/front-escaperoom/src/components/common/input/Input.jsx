import React from "react";
//import "./Input.css"; // Stwórz odpowiedni plik CSS dla stylów

const Input = ({ type, placeholder, value, onChange, name }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className="input"
    />
  );
};

export default Input;
