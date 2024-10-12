import { toast } from "react-toastify";
import { baseUrl, getRequest } from "../requestService";

export const getListFriends = async ({ userId }) => {
  try {
    const response = await getRequest(`${baseUrl}/profiles/friends/list/${userId}`);
    console.log("list friends", response);
    
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.log(error);
  }
};
