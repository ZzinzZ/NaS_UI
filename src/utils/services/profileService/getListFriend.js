import { toast } from "react-toastify";
import { baseUrl, getRequest } from "../requestService";

export const getListFriends = async ({ userId }) => {
  try {
    const response = await getRequest(
      `${baseUrl}/profiles/friends/list/${userId}`
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.log(error);
  }
};

export const getListFriendShortcuts = async ({ userId }) => {
  try {
    const response = await getRequest(
      `${baseUrl}/profiles/friends/list/${userId}`
    );
    const friends = response.data;

    const randomFriends = friends.sort(() => 0.5 - Math.random()).slice(0, 7);

    return randomFriends;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const getListFriendRequests = async ({ userId }) => {
  try {
    const response = await getRequest(
      `${baseUrl}/profiles/friends/requests/${userId}`
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.log(error);
  }
};

export const getListFriendRequestSent = async ({ userId }) => {
  try {
    const response = await getRequest(
      `${baseUrl}/profiles/friends/requests-sent/${userId}`
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.log(error);
  }
};

export const getUnfriendedProfiles = async ({ userId }) => {
  try {
    const response = await getRequest(
      `${baseUrl}/profiles/unfriended/${userId}`
    );
    return response.data;
  } catch (error) {
    // toast.error(error.response.data.message);
    console.log(error);
  }
}

export const getSuggestedProfiles = async ({userId}) => {
  try {
    const response = await getRequest(
      `${baseUrl}/profiles/suggested/${userId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
}