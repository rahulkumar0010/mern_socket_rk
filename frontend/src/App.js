import "./App.css";
import { io } from "socket.io-client";
import SocketContext, { UserContext } from "./config/context";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAccessToken,
  getSocketChatData,
} from "./controller/cookiesController";
import { useReducer, useState } from "react";
import { reducer } from "./store/reducer";
import { initialState } from "./store/initialState";
// App Components
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [token, setToken] = useState(null);
  const [roomIdG, setRoomIdG] = useState(null);
  const localToken = getAccessToken();
  let logedInUser = getSocketChatData()
    ? JSON.parse(getSocketChatData())
    : null;
  let sendToken = token ? token : localToken;
  const socket = io(`http://localhost:4001`, {
    query: { token: sendToken },
  });

  return (
    <div className="App">
      <SocketContext.Provider value={{ socket, logedInUser }}>
        <UserContext.Provider
          value={{
            state,
            dispatch,
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
            </Routes>
          </BrowserRouter>
          <ToastContainer />
        </UserContext.Provider>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
