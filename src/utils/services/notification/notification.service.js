import { toast } from "react-toastify";
import {
  baseUrl,
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "../requestService";

export const createChatNotification = async ({userId, message, refChat}) => {
    try {
        const response = await postRequest(`${baseUrl}/notifications/chat`, {userId, message, refChat});
        return response.data;
    } catch (error) {
        // toast.error(error.response.data.message);
        console.error(error);
    }
};

export const createUserNotification = async ({userId, message, refUser}) => {
    try {
        const response = await postRequest(`${baseUrl}/notifications/user`, {userId, message, refUser});
        return response.data;
    } catch (error) {
        // toast.error(error.response.data.message);
        console.error(error);
    }
};

export const getNotificationByUserId = async ({userId}) => {
    try {
        const response = await getRequest(`${baseUrl}/notifications/list/${userId}`);
        return response.data;
    } catch (error) {
        // toast.error(error.response.data.message);
        console.error(error);
    }
};

export const markNotificationAsRead = async ({notificationId}) => {
    try {
        const response = await putRequest(`${baseUrl}/notifications/read/${notificationId}`);
        return response.data;
    } catch (error) {
        // toast.error(error.response.data.message);
        console.error(error);
    }
}

export const deleteNotification = async ({notificationId}) => {
    try {
        const response = await deleteRequest(`${baseUrl}/notifications/${notificationId}`);
        return response.data;
    } catch (error) {
        // toast.error(error.response.data.message);
        console.error(error);
    }
}