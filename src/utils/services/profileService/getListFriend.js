import { toast } from "react-toastify";
import { baseUrl, getRequest } from "../requestService";

export const getListFriends = async ({ userId }) => {
  try {
    const response = await getRequest(`${baseUrl}/profiles/friends/list/${userId}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.log(error);
  }
};

export const getListFriendRequests = async ({ userId }) => {
  try {
    const response = await getRequest(`${baseUrl}/profiles/friends/requests/${userId}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.log(error);
    
  }
}

export const getListFriendRequestSent = async ({ userId }) => {
  try {
    const response = await getRequest(`${baseUrl}/profiles/friends/requests-sent/${userId}`);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.log(error);
  }
}