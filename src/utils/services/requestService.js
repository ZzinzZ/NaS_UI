import axios from "axios";

export const baseUrl = "http://localhost:5000/api/v1";

export const postRequest = async (url, body) => {
  const user = JSON.parse(localStorage.getItem("User"));
  const token = user?.token;
  const response = await axios({
    method: "POST",
    url,
    data: body,
    headers: {
      ...(token && { "x-auth-token": token }),
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const getRequest = async (url) => {
  const user = JSON.parse(localStorage.getItem("User"));
  const token = user?.token;

  try {
    const response = await axios({
      method: "GET",
      url,
      headers: {
        ...(token && { "x-auth-token": token }),
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error making GET request:", error);
    throw error;
  }
};

export const putRequest = async (url, body) => {
  const user = JSON.parse(localStorage.getItem("User"));
  const token = user?.token;
  const response = await axios({
    method: "PUT",
    url,
    data: body,
    headers: {
      ...(token && { "x-auth-token": token }),
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const deleteRequest = async (url) => {
  const user = JSON.parse(localStorage.getItem("User"));
  const token = user?.token;
  const response = await axios({
    method: "DELETE",
    url,
    headers: {
      ...(token && { "x-auth-token": token }),
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
