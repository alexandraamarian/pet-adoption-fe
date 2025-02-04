import React, { useState, useEffect } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

const AddAdoption = ({ fetchAdoptions }) => {
  const [formData, setFormData] = useState({
    petName: "",
    petAge: "",
    petType: "",
    detailedInformation: "",
  });

  const [userName, setUserName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUserName = localStorage.getItem("username");
    if (storedUserName) setUserName(storedUserName);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Error: Not authenticated");
      return;
    }

    if (!userName) {
      setMessage("Error: Username not found");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("userName", userName);
    formDataToSend.append("petName", formData.petName);
    formDataToSend.append("petAge", formData.petAge);
    formDataToSend.append("petType", formData.petType);
    formDataToSend.append("detailedInformation", formData.detailedInformation);
    if (image) formDataToSend.append("image", image);

    try {
      const response = await fetch(
        "http://74.248.77.144/adoptions/api/adoptions",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataToSend,
        }
      );

      if (!response.ok) throw new Error("Failed to post adoption");

      alert("Adoption posted successfully!");
      setFormData({
        petName: "",
        petAge: "",
        petType: "",
        detailedInformation: "",
      });
      setImage(null);
      setImagePreview(null);
      fetchAdoptions();
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  const isFormValid =
    formData.petName &&
    formData.petAge &&
    formData.petType &&
    formData.detailedInformation &&
    image;

  return (
    <div className="bg-white p-6 rounded-lg w-full max-w-3xl shadow-lg border border-gray-200 mx-auto">
      <h2 className="text-2xl font-bold text-teal-700 mb-4 text-center">
        Add Adoption
      </h2>
      <div className="h-96 overflow-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-300 p-2 rounded-lg">
        <div className="flex items-center gap-4 justify-center mb-4">
          <label className="flex flex-col items-center justify-center w-34 h-34 bg-gray-100 border-2 border-dashed border-purple-500 rounded-lg cursor-pointer hover:bg-purple-50 transition">
            <FaCloudUploadAlt className="text-purple-500 text-4xl mb-2" />
            <span className="text-gray-600 text-sm text-center">
              Upload Image <span className="text-red-500">*</span>
            </span>
            <input
              type="file"
              onChange={handleImageChange}
              className="hidden"
              required
            />
          </label>

          {imagePreview ? (
            <div className="w-34 h-34 border-2 border-purple-500 rounded-lg shadow-md flex justify-center items-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="w-36 h-36 flex items-center justify-center bg-gray-200 border-2 border-gray-300 rounded-lg text-gray-500">
              No Image
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 pb-4">
          <label className="text-gray-700 font-semibold">
            Pet Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="petName"
            placeholder="Pet Name"
            value={formData.petName}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
            aria-invalid={!formData.petName}
          />

          <label className="text-gray-700 font-semibold">
            Pet Age <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="petAge"
            placeholder="Pet Age"
            value={formData.petAge}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
            aria-invalid={!formData.petAge}
          />

          <label className="text-gray-700 font-semibold">
            Pet Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="petType"
            placeholder="Pet Type"
            value={formData.petType}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
            aria-invalid={!formData.petType}
          />

          <label className="text-gray-700 font-semibold">
            Details <span className="text-red-500">*</span>
          </label>
          <textarea
            name="detailedInformation"
            placeholder="Details about the pet"
            value={formData.detailedInformation}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 min-h-12 max-h-32 "
            required
            aria-invalid={!formData.detailedInformation}
          ></textarea>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <button
            onClick={handleSubmit}
            className={`w-3/5 text-white p-3 rounded-lg shadow-md transition  ${
              isFormValid
                ? "bg-purple-500 hover:bg-purple-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isFormValid}
          >
            Submit
          </button>

          {message && <p className="text-red-500 text-sm mt-2">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default AddAdoption;
