
import { Inter } from "next/font/google";
import ReduxProvider from "@/components/provider/ReduxProvider";
import "./globals.css";
import { FetchLoading } from "@/components/generals/LoadingBox";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });
const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
export const metadata = {
  title: "NaSocial",
  description: "Make it simple",
  viewport,
};
function RootLayout({ children }) {
  return (
    <html lang="en">
      <ReduxProvider>
        <body className={inter.className}>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover={false}
          />
          <div>
            <FetchLoading />
            {children}
          </div>
        </body>
      </ReduxProvider>
    </html>
  );
}

export default RootLayout;
