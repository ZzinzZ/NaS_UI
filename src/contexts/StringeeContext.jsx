"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Tạo StringeeContext
const StringeeContext = createContext();

export const useStringee = () => useContext(StringeeContext);

export const StringeeProvider = ({ children }) => {
  

  return (
    <StringeeContext.Provider>
      {children}
    </StringeeContext.Provider>
  );
};
