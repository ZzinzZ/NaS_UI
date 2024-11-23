import { toast } from "react-toastify";
import {
  baseUrl,
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "../requestService";

export const sendMessage = async (
  { senderId, chatId, text, images },
  onUploadProgress
) => {
  try {
    const formData = new FormData();
    formData.append("senderId", senderId);
    formData.append("text", text);
    if (images && images.length > 0) {
      images.forEach((image) => formData.append("images", image));
    }
    const message = await postRequest(
      `${baseUrl}/messages/send/${chatId}`,
      formData
    );
    return message.data;
  } catch (error) {
    toast.error(error.response?.data?.message || error);
  }
};

export const getMessageByChatId = async ({ chatId, userId }) => {
  try {
    const message = await getRequest(
      `${baseUrl}/messages/conversation/${chatId}/${userId}`
    );
    return message.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const deleteSoftMessage = async ({ messageId, userId }) => {
  try {
    const result = await patchRequest(
      `${baseUrl}/messages/delete-soft/${messageId}`,
      { userId }
    );
    return result.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const removeMessage = async ({ messageId, userId }) => {
  try {
    const message = await putRequest(`${baseUrl}/messages/remove/${messageId}`, {
      userId,
    });
    return message.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const markAsRead = async ({ messageId, userId }) => {
  try {
    const message = await patchRequest(
      `${baseUrl}/messages/seen/${messageId}`,
      { userId }
    );
    return message.data;
  } catch (error) {
    // toast.error(error.response.data.message || error);
  }
};

export const replyMessage = async ({ messageId, userId, text, images }) => {
  try {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("text", text);
    if (images && images.length > 0) {
      images.forEach((image) => formData.append("images", image));
    }
    const message = await postRequest(
      `${baseUrl}/messages/reply/${messageId}`,
      formData
    );
    return message.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const reactMessage = async ({ messageId, userId, emotion }) => {
  try {
    const message = await patchRequest(
      `${baseUrl}/messages/react/${messageId}`,
      { userId, emotion }
    );
    return message.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const countUnreadMessages = async ({ userId, chatId }) => {
  try {
    const count = await getRequest(
      `${baseUrl}/messages/unread/count/${chatId}/${userId}`
    );
    return count.data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const deleteChatMessages = async ({ chatId, userId }) => {
  try {
    const response = await putRequest(`${baseUrl}/messages/chat-soft-delete`, {
      chatId,
      userId,
    });
    toast.info(response.message);
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.log(error);
  }
};

export const getUserSeenMessage = async ({ messageId }) => {
  try {
    const response = await getRequest(
      `${baseUrl}/messages/seen-list/${messageId}`
    );
    return response.data;
  } catch (error) {
    // toast.error(error.response.data.message);
    console.log(error);
  }
};

export const getUserReactMessage = async ({ messageId }) => {
  try {
    const response = await getRequest(
      `${baseUrl}/messages/react-list/${messageId}`
    );
    return response.data;
  } catch (error) {
    // toast.error(error.response.data.message);
    console.log(error);
  }
};
