import NavBar from "@/components/layoutComponent/NavBar";
import { Stack } from "@mui/material";
import ProtectedRoute from "@/components/provider/ProtectRoute";
import TokenChecker from "@/components/provider/TokenChecker";

function UserLayout({ children }) {
  return (
    <TokenChecker>
      <ProtectedRoute>
        <NavBar />
        <Stack sx={{ marginTop: "5rem" }}>{children}</Stack>
      </ProtectedRoute>
    </TokenChecker>
  );
}

export default UserLayout;
