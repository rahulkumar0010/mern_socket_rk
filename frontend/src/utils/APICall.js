import { getAccessToken } from "../controller/cookiesController";
import { errorMsg } from "../controller/ToastController";
import API from "./Api";

export const getSingleUser = async (id, setUser) => {
  try {
    const response = await API.get(`/user/getById/${id}`, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    }).then((res) => res.data);

    setUser(response);
  } catch (error) {
    const message = error.response
      ? error.response?.data?.message
      : error.message;
    errorMsg(message);
  }
};
export const updateUserStatus = async (id, data) => {
  try {
    await API.post(`/user/updateStatus/${id}`, data, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    }).then((res) => res.data);
  } catch (error) {
    const message = error.response
      ? error.response?.data?.message
      : error.message;
    errorMsg(message);
  }
};
