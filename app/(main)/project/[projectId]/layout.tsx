import { ReactNode, Suspense } from "react";
import { BarLoader } from "react-spinners";

type ProjectLayoutProps = {
  children: ReactNode;
};

export default async function ProjectLayout({ children }: ProjectLayoutProps) {
  return (
    <div className="mx-auto">
      <Suspense fallback={<BarLoader width={"100%"} color="#36d7b7" />}>
        {children}
      </Suspense>
    </div>
  );
}
