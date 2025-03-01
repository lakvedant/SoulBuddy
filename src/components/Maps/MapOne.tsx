"use client";
import "jsvectormap/dist/jsvectormap.css";
import React, { useEffect } from "react";
import "../../js/us-aea-en";

const MapOne: React.FC = () => {
  useEffect(() => {

    return () => {
      const map = document.getElementById("mapOne");
      if (map) {
        map.innerHTML = "";
      }
      // mapOne.destroy();
    };
  }, []);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
        Region labels
      </h4>
      <div className="h-90">
        <div id="mapOne" className="mapOne map-btn"></div>
      </div>
    </div>
  );
};

export default MapOne;
