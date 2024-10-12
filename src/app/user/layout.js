import NavBar from "@/components/layoutComponent/NavBar";
import { Container, Stack } from "@mui/material";
import ProtectedRoute from "@/components/provider/ProtectRoute";
import TokenChecker from "@/components/provider/TokenChecker";
import Localization from "@/components/provider/LocalizationProvider";

function UserLayout({ children }) {
  return (
    <Localization>
      <TokenChecker>
        <ProtectedRoute>
          <NavBar />
          <Stack sx={{ marginLeft: {xs: 0 , sm: 0, md : "5rem" }}}>{children}</Stack>
        </ProtectedRoute>
      </TokenChecker>
    </Localization>
  );
}

export default UserLayout;
