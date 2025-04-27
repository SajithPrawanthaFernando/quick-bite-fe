"use client";

import { usePathname } from "next/navigation";
import { Header, Footer } from "@/components";
import { ToastProvider } from "@/components/ToastProvider";
import { useAuthInitializer } from "@/hooks/useAuthInitializer";

export const ProvidersWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useAuthInitializer();

  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isDriver = pathname?.startsWith("/driver");

  return (
    <ToastProvider>
      {!(isAdmin || isDriver) && <Header />}
      {children}
      {!(isAdmin || isDriver) && <Footer />}
    </ToastProvider>
  );
};
