import { getFallBack } from "./utils/helpers";

function Castlist({ cast }) {
    if (!cast || cast.length === 0) {
        return <p>No cast available.</p>;
    }

    return (
        <ul>
            {cast.slice(0, 15).map((actor, index) => (
                <li key={`${actor.person?.id ?? "cast"}-${index}`}>
                    {getFallBack(actor.person?.name)} as{" "}
                    {getFallBack(actor.character?.name)}
                </li>
            ))}
        </ul>
    );
}

export default Castlist;