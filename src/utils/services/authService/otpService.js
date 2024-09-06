import { toast } from "react-toastify";
import { baseUrl, postRequest } from "../requestService"

export const sendOtp = async ({email}) => {
    try {
        const result = await postRequest(`${baseUrl}/users/sendOtp`, { email: email });
        toast.info("OTP sent successfully");
        return result.data;
    } catch (error) {
        toast.error(error.message)
    }
}