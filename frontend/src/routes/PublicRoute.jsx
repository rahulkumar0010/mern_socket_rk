import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../controller/cookiesController";

function PublicRoute({ children }) {
    const auth =isAuthenticated()
    return !auth ? children : <Navigate to="/" />;
  }

  export default PublicRoute