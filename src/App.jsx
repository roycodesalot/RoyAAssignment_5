import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
//using USEEFFECT
import { useState, useEffect, useRef } from "react";
import Searchform from "./Searchform";
import Showdetails from "./Showdetails";
import Castlist from "./Castlist";
import { getFallBack, stripHtml } from "./utils/helpers";


function App() {
  //Setting up master state containers
  const [currentSearchWord, setCurrentSearchWord] = useState("Action");
  const [listOfItems, setListOfItems] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [errorMessage, seterrormessage] = useState(null);
  const [castByShow, setCastByShow] = useState({});
  const castRequestId = useRef(0);

  const fetchMyData = async (SearchToken) => {
    castRequestId.current += 1;
    setisLoading(true);
    seterrormessage(null);
    setCastByShow({});
    

    try {
      const response = await fetch(
        `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(SearchToken)}`,
      );

      if (response.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      }

      if (!response.ok) {

        throw new Error(
          `Server had an error. Try again later. ${response.status}`,
        );
      }

      const usableData = await response.json();
      const limitedShows = usableData.slice(0, 10);
      setListOfItems(limitedShows);
    } catch (error) {
      seterrormessage(error.message);
    } finally {
      setisLoading(false);
    }
  };

  //Setting up the function that handles form submissions
  const handleMyFormSubmit = (e) => {
    e.preventDefault();
    //Prevent the default form submission behavior
    if (!currentSearchWord.trim()) {
      seterrormessage("Search term cannot be empty.");
      return;
    }
    console.log("Form submitted! Searching For: ", currentSearchWord);
    fetchMyData(currentSearchWord);
  };

  

  //start up for useEFFECT
  useEffect(() => {
    console.log("App loaded!");
    fetchMyData("Action");
  }, []);

  useEffect(() => {
    if (listOfItems.length === 0) {
      return;
    }


    let isCurrentSearch = true;
    const requestId = castRequestId.current;
    listOfItems.forEach(async ({ show }) => {
      try {
        const response = await fetch(
          `https://api.tvmaze.com/shows/${show.id}/cast`,
        );
        if (!response.ok) {
          throw new Error(
            `Could not load cast for ${show.name}. Server returned ${response.status}.`,
          );
        }

        const cast = await response.json();
        if (isCurrentSearch && requestId === castRequestId.current) {
          setCastByShow((currentCast) => ({
            ...currentCast,
            [show.id]: { cast },
          }));
        }
      } catch (error) {
        if (isCurrentSearch && requestId === castRequestId.current) {
          setCastByShow((currentCast) => ({
            ...currentCast,
            [show.id]: { error: error.message },
          }));
        }
      }
    });

    return () => {
      isCurrentSearch = false;
    };
  }, [listOfItems]);

  //Merged into ONE single return statement
  return (
    <Router>
      <div>
        <Routes>
          {/* Main Home Route*/}
          <Route
            path="/"
            element={
              <div>
                <h1>TVmaze Search</h1>

                {/*Feeding the state and functions into your form component as props */}
                <Searchform
                  textValue={currentSearchWord}
                  OnTextChange={setCurrentSearchWord}
                  handleSubmitting={handleMyFormSubmit}
                />
                {/*Showing loading phase after user inputs */}
                {isLoading && <p>Loading Shows...</p>}
                {errorMessage && (
                  <p style={{ color: "red" }}>Error: {errorMessage}</p>
                )}

                {/*Showing the user the posters when on the applications
                  with viewing details about the poster */}
                  {!isLoading && !errorMessage && (
                    (listOfItems.length === 0) ? (
                      <p>No shows found.</p>
                    ) : (
                    <>
                    <div className="show-grid">
                    {listOfItems.map((item) => (
                      <div key={item.show.id} className="show-card">
                        <h3>{getFallBack(item.show.name)}</h3>
                        {item.show.image?.medium && (
                          <>
                            <img
                              src={item.show.image.medium}
                              alt={`${item.show.name} poster`}
                            />
                          </>
                        )}
                        <div>
                          <p>
                            <strong>Started:</strong>{" "}
                            {getFallBack(item.show.premiered)}
                          </p>
                          <p>
                            <strong>Updated:</strong>{" "}
                            {item.show.updated
                              ? new Date(
                                  item.show.updated * 1000,
                                ).toLocaleString()
                              : "No update available."}
                          </p>

                          <p>
                            <strong>Genres:</strong>{" "}
                            {item.show.genres && item.show.genres.length
                              ? item.show.genres.join(", ")
                              : "No genres available."}
                          </p>
                            <p>
                              <strong>Rating:</strong>{" "}
                              {getFallBack(
                                item.show.rating
                                  ? item.show.rating.average
                                  : "No rating available.",
                              )}
                            </p>
                            {item.show.url ? (
                              <p>
                                <strong>Watch Now:</strong>{" "}
                                <a
                                  href={item.show.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <strong>View Show</strong>
                                </a>
                              </p>
                            ) : (
                              <p>No TVmaze link available.</p>
                            )}
                        </div>

                        <div>
                          <p>
                            {stripHtml(
                              item.show.summary || "No summary available.",
                            )}
                          </p>
                        </div>
                        <section>
                          <h4>Cast</h4>
                          {!castByShow[item.show.id] ? (
                            <p>Loading cast...</p>
                          ) : castByShow[item.show.id]?.error ? (
                            <p style={{ color: "red" }}>
                              Error: {castByShow[item.show.id].error}
                            </p>
                          ) : (
                            <Castlist cast={castByShow[item.show.id]?.cast} />
                          )}
                        </section>

                        <Link to={`/shows/${item.show.id}`}>
                          <strong>View More</strong>
                        </Link>
                      </div>
                    ))}


                    </div>
                    <p>
                      <strong>
                        Found {listOfItems.length} Matching Shows For:
                      </strong>{" "}
                      "{currentSearchWord || "Search"}"
                    </p>
                  </>
                ))}

                {/*My results of overview and list grid components */}
              </div>
            }
          />
          {/*Dynamic details route*/}
          <Route path="/shows/:id" element={<Showdetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
