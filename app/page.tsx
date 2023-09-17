import Image from "next/image";
import { WeatherCard } from "@/components/Cards/Weather";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full justify-center items-center">
      <WeatherCard />
    </main>
  );
}
