"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import AboutOverview from "./AboutOverview";


const IntroductionDetailsInfor = ({profile, isOtherProfile}) => {
  const searchParams = useSearchParams();
  const about = searchParams.get("about") || "overview";

  switch (about) {
    case "overview":
      return <AboutOverview profile={profile} isOtherProfile={isOtherProfile}/>;
    default:
      return <AboutOverview />;
  }
};

export default IntroductionDetailsInfor;
