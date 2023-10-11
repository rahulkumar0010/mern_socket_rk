import { removeAccessToken, setAccessToken, setSocketChatData } from "../../controller/cookiesController";

export const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
       setAccessToken(action.payload.token);
       setSocketChatData(action.payload.user);
      return {
        ...state,
        isAuthenticated: true,
        logInUser: action.payload.user,
        token: action.payload.token,
      };
    case "LOGOUT":
      removeAccessToken()
      return {
        ...state,
        isAuthenticated: false,
        logInUser: null,
        token: null,
      };
    case "ROOMID":
      return {
        ...state,
        roomIdG: action.payload,
      };
    default:
      return state;
  }
};
