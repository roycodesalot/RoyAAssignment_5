import React from "react";
import { Link } from "react-router-dom";
import { getFallBack } from "./utils/helpers";

function Showcard({ item }) {
  // Safe extraction of the show properties
  const show = item?.show;

  if (!show) return null;

  return (
    <div className="show-card">
      <h3>{getFallBack(show.name)}</h3>
      
      {show.image?.medium ? (
        <img
          src={show.image.medium}
          alt={`${show.name} poster`}
        />
      ) : (
        <div style={{ 
          height: "295px", 
          backgroundColor: "#ddd", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          <p>No image available.</p>
        </div>
      )}

      <div>
        {/* Strips any raw HTML tags directly out of the summary descriptor */}
        <p>
          {(show.summary || "No summary available.")
            .replace(/<[^>]*>/g, "")}
        </p>
      </div>

      <Link to={`/shows/${show.id}`}>View More</Link>
    </div>
  );
}

export default Showcard;
