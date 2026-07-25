import { Suspense } from "react";
import HomeClient from "./_components/HomeClient";
import HomeLoading from "./loading";

export default function HomePage() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeClient />
    </Suspense>
  );
}
