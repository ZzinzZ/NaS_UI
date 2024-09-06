"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import IntroduceOverView from "./IntroduceOverView";
import AboutOverview from "./AboutOverview";
import AboutWorkAndEducation from "./AboutWorkAndEducation";
import AboutRelationship from "./AboutRelationship";
import AboutLocation from "./AboutLocation";
import { Typography } from "@mui/material";

const IntroductionDetailsInfor = () => {
  const searchParams = useSearchParams();
  const about = searchParams.get("about") || "overview";

  switch (about) {
    case "overview":
      return <AboutOverview />;
    case "work-and-education":
      return <AboutWorkAndEducation />;
    case "place-of-residence":
      return <AboutLocation />;
    case "contact-and-basic-information":
      return <Typography>No information to show</Typography>;
    case "family-and-relationship":
      return <AboutRelationship />;
    case "life-event":
      return <Typography>No information to show</Typography>;
    default:
      return <AboutOverview />;
  }
};

export default IntroductionDetailsInfor;
