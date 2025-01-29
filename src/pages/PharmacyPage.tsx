import { useState } from "react";
import axios from "axios";
import { AxiosError } from 'axios';
import MedicineSearch from "../components/MedicineSearch";

const GATEWAY_URL = "http://localhost:3000/api/v1";

function PharmacyPage() {
  const [tc, setTc] = useState("");
  const [fullname, setFullname] = useState("");
  const [medicines, setMedicines] = useState<string[]>([]);
  const [prescriptionId, setPrescriptionId] = useState(""); // New state for Prescription ID

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // State for debugging (API response)
  const [prescriptResponse, setPrescriptResponse] = useState<any>(null);

  // Authentication states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null); // State to store the access token

  const register = async () => {
    try {
      await axios.post(`${GATEWAY_URL}/auth/v1/register`, {
        username,
        password,
      });
      alert("Doctor registered successfully!");
    } catch (error) {
      console.error(error);
      alert("Registration failed!");
    }
  };

  const login = async () => {
    try {
      const response = await axios.post(`${GATEWAY_URL}/auth/v1/login`, {
        username,
        password,
      });
      setAccessToken(response.data.access_token); // Store the access token
      alert("Login successful!");
    } catch (error) {
      console.error(error);
      alert("Login failed!");
    }
  };

  const prescript = async () => {
    try {
      if (!accessToken) {
        alert("You need to log in first!");
        return;
      }
  
      // Log the data before sending it to the API
      console.log("Sending data to prescript API:", {
        prescriptionId,
        patientTc: tc, 
        patientName: fullname,
        medicines,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const response = await axios.post(
        `${GATEWAY_URL}/pharmacy/v1/submit-prescription`,
        {
          prescriptionId,  // Pass the prescriptionId here
          patientTc: tc, 
          patientName: fullname,
          medicines,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Pass the access token in the Authorization header
          },
        }
      );
  
      // Log the response for debugging
      console.log("Received response:", response.data);
      setPrescriptResponse(response.data); // Store the API response for debugging
      alert("Prescription created successfully!");
    } catch (error: unknown) {
      console.error("Error creating prescription:", error);
  
      // Check if the error is an instance of AxiosError
      if (axios.isAxiosError(error)) {
        // Access the response data, status, and headers
        console.error("Response data:", error.response?.data);
        console.error("Response status:", error.response?.status);
        console.error("Response headers:", error.response?.headers);
        alert(`Error: ${error.response?.data.message || 'Failed to create prescription'}`);
      } else {
        // Handle other types of errors
        console.error("General error:", error);
        alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };
  

  const addMedicine = (medicine: string) => {
    setMedicines([...medicines, medicine]);
  };

  const removeMedicine = () => {
    setMedicines(medicines.slice(0, -1));
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Pharmacy Panel</h1>

      <div className="mb-4">
        <div className="mb-4">
          <label className="block mb-1">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />
        </div>

        <div className="mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={register}
          >
            [REGISTER]
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={login}
          >
            [LOGIN]
          </button>
        </div>
      </div>

      {/* New Prescription ID section */}
      <div className="mb-4">
        <label className="block mb-1">Prescription ID:</label>
        <input
          type="text"
          value={prescriptionId}
          onChange={(e) => setPrescriptionId(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Patient TC:</label>
        <input
          type="text"
          value={tc}
          onChange={(e) => setTc(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Patient Fullname:</label>
        <input
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
      </div>

      {/* Pass currentPage and setCurrentPage to MedicineSearch */}
      <MedicineSearch 
        onAdd={addMedicine} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
      />

      <div className="mt-4">
        <h3 className="font-semibold">Medicines:</h3>
        <ul className="list-disc pl-6">
          {medicines.map((med, idx) => (
            <li key={idx}>{med}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          onClick={removeMedicine}
        >
          [DELETE]
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={prescript}
        >
          [SUBMIT]
        </button>
      </div>

      {/* Box to show the data being sent to the API */}
      <div className="mt-4 p-4 border rounded bg-gray-50">
        <h3 className="font-semibold">Data Sent to API:</h3>
        <pre>
          {JSON.stringify(
            {
              prescriptionId,  // Add prescriptionId to the displayed data
              tc,
              fullname,
              medicines,
            },
            null,
            2
          )}
        </pre>
      </div>

      {/* Box to show the response from prescript (always visible for debugging) */}
      <div className="mt-4 p-4 border rounded bg-gray-200">
        <h3 className="font-semibold">Prescript API Response Details:</h3>
        <pre>
          {JSON.stringify(prescriptResponse, null, 2) || "No response yet"}
        </pre>
      </div>
    </div>
  );
}

export default PharmacyPage;
