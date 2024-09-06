import { baseUrl, getRequest } from "../requestService"

export const getListPhotos = async ({userId}) => {
    try {
        const photos = await getRequest(`${baseUrl}/posts/list_photos/${userId}`);
        return photos.data;
    } catch (error) {
        console.log(error);
        
    }
}