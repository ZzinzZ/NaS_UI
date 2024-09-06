"use client";
import apiClient from "./apiClient";

export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const postRequest = async (url, body) => {
  try {
    const response = await apiClient.post(url, body);
    return response.data;
  } catch (error) {
    console.error("Error making POST request:", error);
    throw error;
  }
};

export const getRequest = async (url) => {
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error("Error making GET request:", error);
    throw error;
  }
};

export const putRequest = async (url, body) => {
  try {
    const response = await apiClient.put(url, body);
    return response.data;
  } catch (error) {
    console.error("Error making PUT request:", error);
    throw error;
  }
};

export const patchRequest = async (url, body) => {
  try {
    const response = await apiClient.patch(url, body);
    return response.data;
  } catch (error) {
    console.error("Error making PATCH request:", error);
    throw error;
  }
}

export const deleteRequest = async (url) => {
  try {
    const response = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    console.error("Error making DELETE request:", error);
    throw error;
  }
};
