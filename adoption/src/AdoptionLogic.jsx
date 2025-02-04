import React, { useState } from "react";
import AdoptionList from "./AdoptionList";
import AddAdoption from "./AddAdoption";

const AdoptionLogic = () => {
  const [selectedTab, setSelectedTab] = useState("view");

  return (
    <div className="flex flex-col items-center p-6 w-full max-w-4xl">
      <div className="w-full py-3 flex justify-center bg-teal-600 rounded-full shadow-md">
        <button
          className={`px-6 py-2 text-white font-semibold rounded-full transition-all ${
            selectedTab === "add"
              ? "bg-purple-600 scale-105 shadow-lg"
              : "hover:bg-purple-500 opacity-80"
          }`}
          onClick={() => setSelectedTab("add")}
        >
          Add Adoption
        </button>
        <button
          className={`px-6 py-2 text-white font-semibold rounded-full transition-all ml-4 ${
            selectedTab === "view"
              ? "bg-purple-600 scale-105 shadow-lg"
              : "hover:bg-purple-500 opacity-80"
          }`}
          onClick={() => setSelectedTab("view")}
        >
          View Adoptions
        </button>
      </div>

      <div className="w-full mt-6">
        {selectedTab === "view" ? <AdoptionList /> : <AddAdoption />}
      </div>
    </div>
  );
};

export default AdoptionLogic;
