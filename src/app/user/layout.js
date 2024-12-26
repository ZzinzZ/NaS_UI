"use client"
import NavBar from "@/components/layoutComponent/NavBar";
import { Container, Stack } from "@mui/material";
import ProtectedRoute from "@/components/provider/ProtectRoute";
import TokenChecker from "@/components/provider/TokenChecker";
import Localization from "@/components/provider/LocalizationProvider";
import ComingCall from "@/components/chatComponent/ComingCall";
import CallWindow from "@/components/chatComponent/CallWindow";
import { useStringee } from "@/contexts/StringeeContext";
import ImageViewer from "@/components/generals/ImageViewer";

function UserLayout({ children }) {
  const {currentCall, isCalling, incomingCall} = useStringee();
  return (
    <Localization>
      <TokenChecker>
        <ProtectedRoute>
          {isCalling && isCalling && <ComingCall/>}
          {currentCall !== null && !isCalling && <CallWindow/>}
          <NavBar />
          <ImageViewer/>
          <Stack sx={{ marginLeft: { xs: 0, sm: 0, md: "4.6rem" } }}>
            {children}
          </Stack>
        </ProtectedRoute>
      </TokenChecker>
    </Localization>
  );
}

export default UserLayout;
