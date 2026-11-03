//showing the details about the show to the user.
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { stripHtml, getFallBack } from "./utils/helpers";
import Castlist from "./Castlist";

function Showdetails() {
    //pulling the dynamic suffix string right out of browser
    const { id } = useParams();

    //setting up a state container to hold the single show poster
    const [showData, setShowData] = useState(null);
    //setting up a state container to track the loading state
    const [isLoading, setIsLoading] = useState(true);
    //setting up a state container to hold the error message
    const [error, setError] = useState(null);
    // Fetch the selected show whenever its route ID changes.
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        setShowData(null);
        fetch(`https://api.tvmaze.com/shows/${id}?embed=cast`)
            .then((response) => {
                if (response.status === 429) {
                    throw new Error(
                        "Too many requests. Please try again later.",
                    );
                }
                if (!response.ok) {
                    throw new Error(
                        `Server had an error. Try again later. ${response.status}`,
                    );
                }
                return response.json();
            })
            .then((data) => {
                setShowData(data);
                setIsLoading(false);
            })
            .catch((error) => {
                setShowData(null);
                setError(error.message);
                setIsLoading(false);
            });
    }, [id]);

    // Render loading and error states, or the fetched show details.
    return (
        <div style={{ padding: "20px" }}>
            <nav>
                <Link to={"/"}>Back To Gallery Search</Link>
            </nav>

            {isLoading && (
                <>
                    <h2>Loading Profile ID NUMBER: {id}</h2>
                    <p>Loading...</p>
                </>
            )}
            {!isLoading && !showData && !error && <p>No show found.</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {showData && (
                <div>
                    <h3>{getFallBack(showData.name)}</h3>
                    <p>
                        {stripHtml(showData.summary || "No summary available.")}
                    </p>

                    {showData.image && showData.image.medium ? (
                        <img
                            src={getFallBack(showData.image.medium)}
                            alt={showData.name}
                        />
                    ) : (
                        <p>No image available.</p>
                    )}
                    <p>Status: {getFallBack(showData.status)}</p>

                    <p>Started: {getFallBack(showData.premiered)}</p>
                    <p>
                        Updated:{" "}
                        {showData.updated
                            ? new Date(showData.updated * 1000).toLocaleString()
                            : "No update available."}
                    </p>
                    {showData.url ? (
                        <p>
                            Watch Now:{" "}
                            <a
                                href={showData.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                View Show
                            </a>
                        </p>
                    ) : (
                        <p>No TVmaze link available.</p>
                    )}

                    <p>
                        Rating:{" "}
                        {getFallBack(
                            showData.rating
                                ? showData.rating.average
                                : "No rating available.",
                        )}
                    </p>
                    <p>
                        Network:{" "}
                        {showData.network
                            ? showData.network.name
                            : showData.webChannel
                              ? showData.webChannel.name
                              : "No network available."}
                    </p>
                    <p>
                        Genres:{" "}
                        {showData.genres && showData.genres.length
                            ? showData.genres.join(", ")
                            : "No genres available."}
                    </p>
                    <section>
                        <h4>Cast</h4>
                        <Castlist cast={showData._embedded?.cast} />
                    </section>
                </div>
            )}
        </div>
    );
}

export default Showdetails;
