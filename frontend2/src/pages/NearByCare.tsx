import { useState } from "react";
import axios from "axios";

const NearbyCare = () => {
  const [place, setPlace] = useState("");
  const [hospitals, setHospitals] = useState<
    { hospital_name: string; maps_link: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!place.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/nearby-hospitals",
        { placeName: place }
      );
      setHospitals(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch hospitals");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Nearby Hospitals</h1>

      <div className="flex gap-2">
        <input
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="Enter your city or area"
          className="flex-1 px-4 py-2 border rounded-lg bg-[#1a1c24] text-white placeholder-[#6b6f8a] border-[#2a2d3a]"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="space-y-4">
        {hospitals.map((h, i) => (
          <div
            key={i}
            className="p-4 border border-[#2a2d3a] rounded-lg bg-[#1a1c24] flex justify-between items-center"
          >
            <span>{h.hospital_name}</span>
            <a
              href={h.maps_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              View on Map
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyCare;
