import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");       // Original URL input by user
  const [hashedUrl, setHashedUrl] = useState(""); // Hashed URL from backend
  const [errorMessage, setErrorMessage] = useState(""); // Error message

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/url", { url });
      setHashedUrl(`${response.data.shortUrl}`);
    } catch (error) {
      setErrorMessage("Error: Unable to hash URL. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Url Hashing & Tracking</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button type="submit">Hash URL</button>
      </form>
      {hashedUrl && (
        <p>
          <strong>Hashed URL: </strong>
          <a href={hashedUrl} target="_blank" rel="noopener noreferrer">
            {hashedUrl}
          </a>
        </p>
      )}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}

export default App;
