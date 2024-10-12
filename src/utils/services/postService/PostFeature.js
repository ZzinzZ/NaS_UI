
import { toast } from "react-toastify";
import { baseUrl, postRequest, deleteRequest } from "../requestService"; // sử dụng postRequest của bạn

export const createPost = async ({ userId, content, files }) => {
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("content", content);

  if (files && files.length > 0) {
    files.forEach((file) => formData.append("pictures", file));
  }

  try {
    const response = await postRequest(`${baseUrl}/posts/article`, formData);
    return response;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const deletePost = async ({postId}) => {
    try {
        const response = await deleteRequest(`${baseUrl}/posts/${postId}`);
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
        console.error(error);
    }
}