import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../controller/cookiesController";

function PrivateRoute({ children }) {
    const auth =isAuthenticated()
    return auth ? children : <Navigate to="/login" />;
  }

  export default PrivateRoute