import React from "react";
import Image from "next/image";
import { Button, Stack } from "@mui/material";

const PotentialChat = () => {
  return (
    <div className="potential-all-users">
      <div className="potential-single-user">
        <Button>
          <Stack
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Image
              src="/images.jpg"
              width={60}
              height={60}
              alt="user"
              className="potential-avatar"
            />
            <span className="user-online"></span>
          </Stack>
        </Button>
        <span className="potential-username">User Name</span>
      </div>
    </div>
  );
};

export default PotentialChat;
