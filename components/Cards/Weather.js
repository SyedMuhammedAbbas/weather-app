"use client";

import React, { useEffect, useState, useCallback } from "react";
import { BsSearch } from "react-icons/bs";
import { MdLocationOn } from "react-icons/md";
import axios from "axios";

import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "@/utils/motion";

const API_KEY = "4cf54eb7d7122c73ec2c5793dd3de503";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

export const WeatherCard = () => {
  const [city, setCity] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [location, setLocation] = useState();
  const [celsius, setCelsius] = useState();

  const handleSearch = (e) => {
    setCity(e.target.value);
  };

  const fetchData = useCallback(async () => {
    try {
      if (location) {
        const { latitude, longitude } = location;
        const response = await axios.get(
          `${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
        );
        setSearchResults(response.data);
        setCelsius(response.data.main.temp - 273.15);
      }
      if (city) {
        const response = await axios.get(
          `${API_URL}?q=${city}&appid=${API_KEY}`
        );
        setSearchResults(response.data);
        setCelsius(response.data.main.temp - 273.15);
      }
    } catch (error) {
      setSearchResults(null);
      console.error("Error fetching data:", error);
    }
  }, [city, location]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation({ latitude, longitude });
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <main className="flex justify-center items-center w-[360px]">
      <Tilt
        className="xs:w-[360px] xs:h-[500px] w-full"
        options={{ max: 45, scale: 1, speed: 450 }}
      >
        <motion.div
          variants={fadeIn("right", "spring", 0.5, 0.75)}
          className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
        >
          <div className="bg-[#4b267c] rounded-[20px] py-5 px-12  min-h-[500px] flex justify-evenly items-center flex-col">
            <div className="flex gap-4 justify-center items-center">
              <div className="rounded-[15px] bg-[#e2e2e2] p-2 w-[250px] h-[50px] flex justify-center items-center">
                <input
                  type="search"
                  value={city}
                  className="w-[90%] bg-transparent h-[45px] outline-none text-[#000000]"
                  onChange={handleSearch}
                />
              </div>
              <button
                onClick={fetchData}
                className="text-[#000000] text-[15px] bg-[#ffffff] rounded-full p-3"
              >
                <BsSearch />
              </button>
            </div>

            {searchResults ? (
              <div className="flex flex-col w-full h-full justify-center items-center">
                <div className="">
                  <h3 className="text-[45px] text-[#ffffff]">
                    {celsius.toFixed(2)}°C
                  </h3>
                  {/* <h3>{searchResults.main.temp}°F</h3> */}
                </div>
                <div className="flex gap-3 items-center">
                  <div className="text-[#FFD700] text-[25px]">
                    <MdLocationOn />
                  </div>
                  <h2 className="text-[#C0C0C0] font-bold text-[30px]">
                    {searchResults.name}
                  </h2>
                </div>
              </div>
            ) : (
              <div className="text-[#000000] flex w-full h-full justify-center items-center font-bold text-[30px]">
                No Data Found
              </div>
            )}
          </div>
        </motion.div>
      </Tilt>
    </main>
  );
};
