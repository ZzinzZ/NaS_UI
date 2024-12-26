import { toast } from "react-toastify";
import { baseUrl, putRequest } from "../requestService"

export const resetPassword = async ({email, otp, password}) => {
    try {
        const response = await putRequest(`${baseUrl}/users/password/change` ,{email, otp, password});
        toast.success("Password reset successfully");
    } catch (error) {
        toast.error(error.response.data.message);
    }
}