import { toast } from "react-toastify";

const { getRequest } = require("../services/requestService");

const checkMail = async (mail) => {
  try {
    const response = await getRequest(
      `https://mailbite.io/api/check?key=${process.env.NEXT_PUBLIC_MAILBITE_API_KEY}&email=${mail}`
    );
    return {
      status: response.status,
      email_status: response.email_status,
    };
  } catch (error) {
    toast.error(error.message);
    return;
  }
};

export default checkMail;
