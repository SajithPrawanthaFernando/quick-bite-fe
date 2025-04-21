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

  return (
    <ToastProvider>
      {!isAdmin && <Header />}
      {children}
      {!isAdmin && <Footer />}
    </ToastProvider>
  );
};
