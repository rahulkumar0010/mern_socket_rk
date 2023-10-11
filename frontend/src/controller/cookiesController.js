import Cookies from "js-cookie";

export const setAccessToken = (data) => {
  Cookies.set("socketChat", data);
};

export const getAccessToken = () => {
  return Cookies.get("socketChat");
};

export const removeAccessToken = () => {
  Cookies.remove("socketChat");
};

export const isAuthenticated = () => {
  return getAccessToken() ? true : false;
};

export const setSocketChatData = (data) => {
  Cookies.set("socketChatData", JSON.stringify(data));
};
export const getSocketChatData = () => {
  return Cookies.get("socketChatData");
};

export const removeSocketChatData = () => {
  Cookies.remove("socketChatData");
};
