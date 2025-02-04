import React from "react";

const AdoptionPreview = ({ adoption }) => {
  return (
    <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md transition-all duration-300">
      <h3 className="text-lg font-semibold text-gray-800">
        {adoption.petName}
      </h3>
      <p className="text-gray-600">Posted by: {adoption.userName}</p>
      <p className="text-gray-700">{adoption.detailedInformation}</p>
    </div>
  );
};

export default AdoptionPreview;
