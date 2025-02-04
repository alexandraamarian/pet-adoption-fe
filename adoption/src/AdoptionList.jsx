import React, { useState, useEffect } from "react";
import AdoptionPreview from "./AdoptionPreview";
import { MdDelete, MdNotificationsActive } from "react-icons/md";

function AdoptionList() {
  const [adoptions, setAdoptions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const loggedInUser = localStorage.getItem("username");

  useEffect(() => {
    fetchAdoptions();
  }, []);

  const fetchAdoptions = async () => {
    try {
      const response = await fetch(
        "http://74.248.77.144/adoptions/api/adoptions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch adoptions");

      const data = await response.json();
      setAdoptions(data.content);
    } catch (err) {
      console.error("Error fetching adoptions:", err);
    }
  };

  const handleDelete = async (adoptionId, owner) => {
    if (loggedInUser !== owner) {
      alert("You can only delete your own adoption posts.");
      return;
    }

    try {
      const response = await fetch(
        `http://74.248.77.144/adoptions/api/adoptions/${adoptionId}?userName=${loggedInUser}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 204) {
        setAdoptions(
          adoptions.filter((adoption) => adoption.adoptionId !== adoptionId)
        );
        alert("Adoption deleted successfully");
      } else {
        throw new Error("Failed to delete adoption");
      }
    } catch (err) {
      console.error("Error deleting adoption:", err);
    }
  };

  const handleSubscribe = async (adoptionId, posterUserName) => {
    const subscriberUserName = loggedInUser; // The user who is subscribing

    try {
      const response = await fetch(
        `http://74.248.77.144/adoptions/api/adoptions/${adoptionId}/subscription?posterUserName=${encodeURIComponent(
          posterUserName
        )}&subscriberUserName=${encodeURIComponent(subscriberUserName)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to subscribe");

      alert("Subscription successful! You will receive updates.");
    } catch (err) {
      setMessage("Error subscribing: " + err.message);
    }
  };

  return (
    <div className="p-6 rounded-lg w-full max-w-3xl mx-auto bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-teal-700 text-center mb-4">
        Available Pets for Adoption
      </h2>

      <div className="h-96 overflow-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-300  p-2 rounded-lg">
        {adoptions.length === 0 ? (
          <p className="text-gray-600 text-center ">
            No pets available for adoption
          </p>
        ) : (
          <ul className="space-y-4">
            {adoptions.map((adoption) => (
              <li
                key={adoption.adoptionId}
                className="relative p-6 bg-white border rounded-xl shadow-md"
              >
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    onClick={() =>
                      handleSubscribe(adoption.adoptionId, adoption.userName)
                    }
                    className="flex items-center bg-gradient-to-r from-purple-500 to-purple-700 text-white px-1 py-1 rounded-lg shadow-md hover:from-purple-600 hover:to-purple-800 transition-all"
                  >
                    <MdNotificationsActive className=" text-lg" />
                  </button>
                </div>

                <div className="flex justify-center mt-8">
                  <img
                    src={`data:image/jpeg;base64,${adoption.petImage}`}
                    alt="Pet"
                    className="w-24 h-24 object-cover rounded-full border-4 border-purple-500 shadow-md"
                  />
                </div>

                <div className="text-center mt-3">
                  <h3 className="text-xl font-bold text-gray-800">
                    {adoption.petName}
                  </h3>
                  <p className="text-gray-600">
                    {adoption.petType} - {adoption.petAge}
                  </p>
                  <p className="text-sm text-gray-500">
                    Posted by: {adoption.userName}
                  </p>
                </div>

                <div className="flex justify-center mt-3 gap-2">
                  <button
                    className="text-purple-600 font-semibold border border-purple-500 px-3 py-1 rounded-full hover:bg-purple-500 hover:text-white transition"
                    onClick={() =>
                      setExpandedId(
                        expandedId === adoption.adoptionId
                          ? null
                          : adoption.adoptionId
                      )
                    }
                  >
                    {expandedId === adoption.adoptionId
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                  {loggedInUser === adoption.userName && (
                    <button
                      className="text-red-500 hover:text-red-700 font-semibold"
                      onClick={() =>
                        handleDelete(adoption.adoptionId, adoption.userName)
                      }
                    >
                      <MdDelete size={20} />
                    </button>
                  )}
                </div>

                {message && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    {message}
                  </p>
                )}

                {expandedId === adoption.adoptionId && (
                  <AdoptionPreview adoption={adoption} />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdoptionList;
