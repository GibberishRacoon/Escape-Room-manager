import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import Button from "../common/button/Button";
import Input from "../common/input/Input";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // Dodany stan dla błędów
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Resetowanie komunikatów o błędach

    const userData = {
      email: credentials.email,
      password: credentials.password,
    };

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", //dodane i czyta w sesji
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Błąd sieciowy przy logowaniu.");
      }

      login(data.user); // Aktualizacja stanu użytkownika w kontekście
      navigate("/dashboard"); // Przekierowanie użytkownika, np. używając useNavigate z react-router-dom
    } catch (error) {
      setError(error.message);
    }
  };
  const handleGoToRegister = () => {
    navigate("/register"); // Przekierowanie do strony rejestracji
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          name="email"
        />
        <Input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          name="password"
        />
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Wyświetlanie błędów */}
        <Button type="submit">Log In</Button>
      </form>
      <button onClick={handleGoToRegister} className="button">
        Nie masz konta? Zarejestruj się
      </button>
    </div>
  );
};

export default LoginForm;
