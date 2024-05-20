import React, { useState, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../common/button/Button";
import Input from "../common/input/Input";

const RegisterForm = () => {
  const [registrationData, setRegistrationData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData({ ...registrationData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Przygotuj dane do wysłania
    const userData = {
      username: registrationData.username,
      email: registrationData.email,
      password: registrationData.password,
      // Możesz dodać więcej pól, jeśli są wymagane przez backend
    };

    // Wykonaj zapytanie do endpointu rejestracji
    fetch("http://localhost:3000/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "Błąd sieciowy przy rejestracji.");
          });
        }
        return response.json();
      })
      .then((data) => {
        // Pomyślna rejestracja, przekieruj na dashboard
        navigate("/dashboard");
        console.log(data);
      })
      .catch((error) => {
        // Wyświetl komunikat o błędzie
        console.error("Wystąpił błąd:", error);
        alert(error.message); // Możesz zastąpić alert lepszym sposobem wyświetlania błędów
      });
  };
  const handleGoToLogin = () => {
    navigate("/login"); // Przekierowanie do strony rejestracji
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={registrationData.username}
          onChange={handleChange}
          name="username"
        />
        <Input
          type="email"
          placeholder="Email"
          value={registrationData.email}
          onChange={handleChange}
          name="email"
        />
        <Input
          type="password"
          placeholder="Password"
          value={registrationData.password}
          onChange={handleChange}
          name="password"
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          value={registrationData.confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
        />
        <Button type="submit" className="button">
          Register
        </Button>
      </form>
      <button onClick={handleGoToLogin} className="button">
        Masz już konto? Zaloguj się!
      </button>
    </div>
  );
};

export default RegisterForm;
