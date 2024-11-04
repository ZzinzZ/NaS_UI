import { toast } from "react-toastify";
import { baseUrl, deleteRequest, getRequest, patchRequest, postRequest } from "../requestService"

export const createPrivateChat = async ({userId, participants}) => {
    try {
        const chat = await postRequest(`${baseUrl}/chats/private`, {userId, participants});
        return chat.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

export const createGroupChat = async ({userId, participants, chatName}) => {
    try {
        const chat = await postRequest(`${baseUrl}/chats/group`, {userId,participants, chatName});
        toast.info(chat.message)
        return chat.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

export const getChatDetails = async ({chatId}) => {
    try {
        const chat = await getRequest(`${baseUrl}/chats/details/${chatId}`);
        return chat.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

export const updateChatName = async ({chatId, chatName}) => {
    try {
        const chat = await patchRequest(`${baseUrl}/chats/group/chat-name/${chatId}`, {chatName});
        return chat.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

export const updateChatAvatar = async({chatId, avatar}) => {
    try {
        const formData = new FormData();
        formData.append("avatar", avatar);
        const chat = await patchRequest(`${baseUrl}/chats/group/chat-avatar/${chatId}`,formData);
        toast.info(chat.message);
        return chat.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

export const addGroupMember = async({chatId, participants}) => {
    try {
        const chat = await postRequest(`${baseUrl}/chats/group/members/${chatId}`, {participants: participants});
        return chat.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

export const removeGroupMember = async({chatId,creatorId, userId}) => {
    try {
        const chat = await deleteRequest(`${baseUrl}/chats/group/members/kick/${chatId}`,{creatorId,userId});
        return chat.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

export const leaveChat = async({chatId, userId}) => {
    try {
        const chat = await deleteRequest(`${baseUrl}/chats/group/members/leave/${chatId}`, {userId});
        return chat.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
}

export const getChatsList = async({userId}) => {
    try {
        const chats = await getRequest(`${baseUrl}/chats/list/${userId}`);
        return chats.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
}

export const deleteChat = async({chatId, userId}) => {
    try {
        const response = await deleteRequest(`${baseUrl}/chats/group/${chatId}`,{userId});
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
};

export const findChatByName = async ({chatName, userId}) => {
    try {
        const response = await postRequest(`${baseUrl}/chats/list/find`,{chatName, userId});
        return response.data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
}



