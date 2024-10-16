import { toast } from "react-toastify";
import { baseUrl, deleteRequest, getRequest, postRequest } from "../requestService"

export const getUserSearchHistory = async ({userId}) => {
    try {
        const histories = await getRequest(`${baseUrl}/search/${userId}`);
        return histories.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

export const deleteUserSearchHistory = async ({searchId}) => {
    try {
        await deleteRequest(`${baseUrl}/search/${searchId}`);
    } catch (error) {
        toast.error(error.response.data.message);
    }
}

export const searchUserProfile = async ({userName, userId}) => {
    try {
        const profiles = await postRequest(`${baseUrl}/profiles/search`, {userName, userId});
        return profiles.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
}