import Navbar from "~/components/elements/Navbar";
import Footer from "~/components/elements/Footer";
import { Outlet } from "react-router";
import { ThemeProvider } from "~/context/theme-provider";
import { Toaster } from "~/components/ui/sonner";

export default function Page() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main>
        <Navbar />
        <main className="pt-15 px-5 md:px-22 max-w-[1920px] mx-auto min-h-screen border-x-[2px] overflow-x-hidden flex flex-col items-center">
          <Outlet />
          <Toaster />
        </main>
        <Footer />
      </main>
    </ThemeProvider>
  );
}
