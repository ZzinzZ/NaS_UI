import { toast } from "react-toastify";
import {
  baseUrl,
  deleteRequest,
  patchRequest,
  postRequest,
  putRequest,
} from "../requestService";

export const addProfileExperience = async ({
  userId,
  company,
  position,
  start,
  end,
  status,
}) => {
  try {
    const response = await postRequest(
      `${baseUrl}/profiles/experience/${userId}`,
      { company, position, start, end, status }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error(error);
  }
};

export const addProfileEducation = async ({ userId, school, start, end }) => {
  try {
    const response = await postRequest(
      `${baseUrl}/profiles/education/${userId}`,
      { school, start, end }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error(error);
  }
};

export const addProfileLocation = async ({ userId, type_location, city }) => {
  try {
    const response = await postRequest(
      `${baseUrl}/profiles/location/${userId}`,
      { type_location, city }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error(error);
  }
};

export const editProfileExperience = async ({
  userId,
  experienceId,
  company,
  position,
  start,
  end,
  status,
}) => {
  try {
    const response = await patchRequest(
      `${baseUrl}/profiles/experience/${userId}`,
      { experienceId, company, position, start, end, status }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
    console.error(error);
  }
};

export const editProfileEducation = async ({
  userId,
  educationId,
  school,
  start,
  end,
  status,
}) => {
  try {
    const response = await patchRequest(
      `${baseUrl}/profiles/education/${userId}`,
      { educationId, school, start, end, status }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error(error);
  }
};

export const editProfileLocation = async ({
  userId,
  locationId,
  type_location,
  city,
  status,
}) => {
  try {
    const response = await patchRequest(
      `${baseUrl}/profiles/location/${userId}`,
      { locationId, type_location, city, status }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error(error);
  }
};

export const editProfileRelationship = async ({ userId, type, status }) => {
  try {
    const response = await patchRequest(
      `${baseUrl}/profiles/relationship/${userId}`,
      { type, status }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error(error);
  }
};

export const deleteProfileExperience = async ({ userId, experienceId }) => {
  try {
    const response = await deleteRequest(
      `${baseUrl}/profiles/experience/${userId}`,
      { experienceId }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error(error);
  }
};

export const deleteProfileEducation = async ({ userId, educationId }) => {
  try {
    const response = await deleteRequest(
      `${baseUrl}/profiles/education/${userId}`,
      { educationId }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error(error);
  }
};

export const deleteProfileLocation = async ({ userId, locationId }) => {
  try {
    const response = await deleteRequest(
      `${baseUrl}/profiles/location/${userId}`,
      { locationId }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error(error);
  }
};

export const blockUser = async ({ blockerId, blockedId }) => {
  try {
    const response = await putRequest(
      `${baseUrl}/profiles/friends/block/${blockerId}`,
      { blockedId }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error(error);
  }
};

export const unblockUser = async ({ unblockerId, blockedId }) => {
  try {
    const response = await putRequest(
      `${baseUrl}/profiles/friends/unblock/${unblockerId}`,
      { blockedId }
    );
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error(error);
  }
};
