"use client";
import { hideImage } from "@/redux/slices/imageSlice";
import { Dialog } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const ImageViewer = () => {
  const { show, src } = useSelector((state) => state.image);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(hideImage());
  };

  return (
    <Dialog open={show} disableScrollLock={true} onClose={handleClose}>
      {src ? (
        <Image
          src={src}
          alt="Preview Image"
          width={1000}
          height={800}
          style={{ width: "auto", height: "80vh", objectFit: "contain" }}
        />
      ) : (
        <div style={{ padding: "20px", textAlign: "center" }}>
          No image to display
        </div>
      )}
      <button
        onClick={handleClose}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        ✖
      </button>
    </Dialog>
  );
};

export default ImageViewer;
