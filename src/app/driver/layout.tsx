import { DriverDashboard } from "@/components";


export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DriverDashboard>{children}</DriverDashboard>;
}
