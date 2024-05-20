import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useMemo,
  useRef,
} from "react";
import AuthContext from "../../../contexts/AuthContext";
import Category from "../../category/category";

// Definicja reducer
const reviewReducer = (state, action) => {
  switch (action.type) {
    case "SET_RATING":
      return { ...state, rating: action.payload };
    case "SET_COMMENT":
      return { ...state, comment: action.payload };
    case "RESET_FORM":
      return { rating: "", comment: "" };
    default:
      return state;
  }
};

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const { user } = useContext(AuthContext);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [fileToImport, setFileToImport] = useState(null);

  const [state, dispatch] = useReducer(reviewReducer, {
    rating: "",
    comment: "",
  });
  // Obliczanie danych do eksportu tylko wtedy, gdy lista recenzji się zmieni
  const reviewsForExport = useMemo(() => {
    return JSON.stringify(reviews, null, 2);
  }, [reviews]);

  useEffect(() => {
    fetchReviews();
    fetchAvailableRooms();
  }, []);

  const getColorClass = (grade) => {
    if (grade < 3) return "badReview";
    if (grade > 3) return "goodReview";
    return "neutralReview";
  };

  // Funkcja do eksportowania opinii do pliku JSON
  const exportReviewsToJSON = () => {
    const dataBlob = new Blob([reviewsForExport], { type: "application/json" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(dataBlob);
    downloadLink.download = "reviews.json";
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:3000/reviews");
      if (!response.ok) {
        throw new Error("Błąd podczas pobierania opinii");
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Błąd: ", error);
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const response = await fetch("http://localhost:3000/rooms");
      if (!response.ok) {
        throw new Error("Błąd podczas pobierania dostępnych pokojów");
      }
      const data = await response.json();
      setAvailableRooms(data);
      //console.log(data); sprawdzanie czy przesyla
    } catch (error) {
      console.error("Błąd: ", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    dispatch({ type: `SET_${name.toUpperCase()}`, payload: value });
  };

  const handleSubmitReview = async () => {
    try {
      const response = await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...state,
          user: user._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Problem z dodaniem opinii");
      }

      const addedReview = await response.json();
      setReviews([...reviews, addedReview]);
      dispatch({ type: "RESET_FORM" }); // Zresetuj formularz
    } catch (error) {
      console.error("Błąd: ", error);
    }
  };

  const handleFileInputChange = (e) => {
    setFileToImport(e.target.files[0]);
  };

  const handleImportReviews = async () => {
    if (!fileToImport) {
      alert("Proszę wybrać plik do importu.");
      return;
    }
    console.log(fileToImport);
    const formData = new FormData();
    formData.append("file", fileToImport);

    try {
      const response = await fetch("http://localhost:3000/reviews/import", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const importedReviews = await response.json();
        console.log("Import opinii zakończony pomyślnie.", importedReviews);
      } else {
        throw new Error(
          "Problem z importem opinii. Kod statusu: " + response.status
        );
      }
    } catch (error) {
      console.error("Błąd w funkcji handleImportReviews: ", error);
      alert("Wystąpił błąd podczas importu opinii.");
    }
  };

  return (
    <Category title="Sekcja Opinii">
      <div className="list">
        <ul>
          {reviews.map((review, index) => (
            <li key={index}>
              <p>
                Ocena:{" "}
                <span className={getColorClass(review.rating)}>
                  {review.rating}
                </span>
              </p>
              <p>Komentarz: {review.comment}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type="number"
          name="rating"
          placeholder="Ocena (1-5)"
          value={state.rating}
          onChange={handleInputChange}
          min="1"
          max="5"
          step="1"
        />
        <textarea
          name="comment"
          placeholder="Komentarz"
          value={state.comment}
          onChange={handleInputChange}
        />
        <button onClick={handleSubmitReview} className="button button-gradient">
          Dodaj opinię
        </button>

        {user && user.isAdmin && (
          <>
            <button
              onClick={exportReviewsToJSON}
              className="button button-gradient"
            >
              Eksportuj Opinie do JSON
            </button>
            <input
              type="file"
              onChange={handleFileInputChange}
              style={{ display: "none" }}
              accept=".json"
            />
            <button
              onClick={() =>
                document.querySelector('input[type="file"]').click()
              }
              className="button button-gradient"
            >
              Importuj Opinie
            </button>
            <button
              onClick={handleImportReviews}
              className="button button-gradient"
            >
              Prześlij plik do API
            </button>
          </>
        )}
      </div>
    </Category>
  );
};

export default ReviewsSection;
