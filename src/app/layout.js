import { Inter } from "next/font/google";
import ReduxProvider from "@/components/provider/ReduxProvider";
import "./globals.css";
import { FetchLoading } from "@/components/generals/LoadingBox";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeProviderWarp from "@/components/provider/ThemeProvider";
import Localization from "@/components/provider/LocalizationProvider";

const inter = Inter({ subsets: ["latin"] });
// const viewport = {
//   width: "device-width",
//   initialScale: 1,
//   maximumScale: 1,
// };
export const metadata = {
  title: "NaS",
  description: "Make it simple",
  icons: {
    icon: "/NA_logo.jpg",
  },
};
function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous" 
      ></link>
      <link
        href="https://fonts.googleapis.com/css2?family=Grey+Qo&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&family=Sankofa+Display&display=swap"
        rel="stylesheet"
      ></link>
    </head>
    <body className={inter.className}>
      <ThemeProviderWarp>
        <Localization>
          <ReduxProvider>
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
            <FetchLoading />
            {children}
          </ReduxProvider>
        </Localization>
      </ThemeProviderWarp>
    </body>
  </html>
  );
}

export default RootLayout;
