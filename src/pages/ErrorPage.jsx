import { NavLink,useRouteError } from "react-router-dom";

export const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);
    return (
        <div>
            <h1>Opps ! An error occured</h1>
            {error && <p>{error.data}</p>}
            <NavLink to={'/'}> <button>Go Back to Home</button></NavLink>
        </div>
    );
};