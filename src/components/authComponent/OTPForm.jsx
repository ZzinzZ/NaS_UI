"use client";
import { hideLoading, showLoading } from "@/redux/slices/LoadingSlice";
import { baseUrl, postRequest } from "@/utils/services/requestService";
import { Dialog, Button } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const OtpForm = ({ open, handleClose, email, verified }) => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== "" && e.target.nextSibling) {
        e.target.nextSibling.focus();
      } else if (value === "" && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const handleVerifyOTP = async () => {
    dispatch(showLoading());
    try {
      const otpCode = otp.join("");
      const response = await postRequest(`${baseUrl}/users/verifyOtp`, {
        email: email,
        otp: otpCode,
      });
      verified(otpCode);
      handleClose();
      toast.info("OTP Verified Successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handleResendOTP = async () => {
    dispatch(showLoading());
    try {
      await postRequest(`${baseUrl}/users/sendOtp`, { email });
      toast.info("Resend OTP success");
    } catch (error) {
      toast.error(error.message);
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form className="otp-Form">
        <span className="mainHeading">Enter OTP</span>
        <p className="otpSubheading">
          We have sent a verification code to your mobile number
        </p>
        <div className="inputContainer">
          {otp.map((data, index) => (
            <input
              key={index}
              required
              maxLength="1"
              type="text"
              className="otp-input"
              value={data}
              onChange={(e) => handleChange(e, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>
        <Button className="verifyButton" onClick={handleVerifyOTP}>
          Verify
        </Button>
        <button className="exitBtn" type="button" onClick={handleClose}>
          ×
        </button>
        <p className="resendNote">
          Didn&#39;t receive the code?{" "}
          <button className="resendBtn" onClick={handleResendOTP}>
            Resend Code
          </button>
        </p>
      </form>
    </Dialog>
  );
};

export default OtpForm;
