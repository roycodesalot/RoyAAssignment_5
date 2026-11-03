Demo React client

# Getting Started

- Clone the repository
```
git clone <repo url>
```
- Run `npm install` to install dependencies
- add a `.env` file in the root directory with the following content:

```
VITE_API_URL= <your api url>
```

run `npm run dev` to start the development server

TVmaze Search - React Gallery

A React app that searches TV shows, shows them in a grid, and opens a detail page for each show. Built with Vite, React, and React Router, using the TVmaze public API.

How to run:

npm install
npm run dev

React concepts used

Components, one per file: App.jsx, Searchform.jsx, Showdetails.jsx, Castlist.jsx
Lists with map() and stable keys: show id in the gallery, person id in the cast list

Conditional states: loading, error, empty search, no results, and results, in App.jsx and Showdetails.jsx

Controlled form: Searchform.jsx with value, onChange, onSubmit and preventDefault
useState and useEffect: search state and fetch in App.jsx, id-based fetch in Showdetails.jsx, per-show cast fetch in App.jsx

Lifted state: search word and results live in App.jsx, the form and the results count use that shared state

React Router: / for gallery, /shows/:id for detail, with Link and useParams

Fetch checks: response ok checked before reading JSON, in App.jsx and Showdetails.jsx

Helpers: HTML stripping and fallbacks in your utils helpers file, verify the exact file path before you submit

AI use
I used an AI tutor for explanations, generic examples, and reviewing my code. I wrote and fixed the project code myself, and I can explain every line.

Reflection:
This project taught me how React actually manages data, not just how to write components. The hardest part was learning that data lives in nested boxes, so I had to check a box before reading a field inside it, otherwise the page would crash or show a fallback. I also learned why effects need the right dependency, like the show id on the detail page, and why a cast fetch needs its own loading and error state so one failed cast does not break the whole gallery. Fixing the poster, updated date, and cast wiring one field at a time helped me understand fallbacks, date conversion, and lists with stable keys much better than just copying a working example would have.

