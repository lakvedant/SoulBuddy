'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { Clock, MapPin, Users, Calendar } from "lucide-react";

const AdditionalDetails = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locations, setLocations] = useState<Array<{
    name: string;
    longitude: number;
    latitude: number;
  }>>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    dateOfBirth: "",
    timeOfBirth: "",
    timeUnknown: false,
    placeOfBirth: "",
    longitude: 0,
    latitude: 0,
    gender: ""
  });

  const handleLocationSearch = async (search: string) => {
    setSearchTerm(search);
    if (search.length < 2) {
      setLocations([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(search)}&type=city&format=json&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}`
      );
      const data = await response.json();
      
      const formattedLocations = data.results.map((result: any) => ({
        name: `${result.city || result.name}, ${result.country}`,
        longitude: result.lon,
        latitude: result.lat
      }));
      
      setLocations(formattedLocations);
    } catch (err) {
      console.error('Error fetching locations:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No authenticated user found");
      }

      const submitData = {
        user_id: currentUser.uid,
        dateOfBirth: formData.dateOfBirth,
        timeOfBirth: formData.timeOfBirth,
        timeUnknown: formData.timeUnknown,
        placeOfBirth: formData.placeOfBirth,
        longitude: formData.longitude,
        latitude: formData.latitude,
        gender: formData.gender
      };

      console.log('Sending data to API:', submitData);

      const response = await fetch('/api/users/additional-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || 'Failed to save details');
      }

      // Redirect to dashboard on success
      router.push("/dashboard");

    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-boxdark-2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-boxdark rounded-xl shadow-lg">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-black dark:text-white">
              Birth Details
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Please provide your birth information to complete your profile
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 text-sm text-red-500 bg-red-100 dark:bg-red-900/30 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-base font-semibold text-black dark:text-white">
                <Calendar className="h-5 w-5" />
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none transition focus:border-primary focus:ring-1 focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-base font-semibold text-black dark:text-white">
                <Clock className="h-5 w-5" />
                Time of Birth
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="time"
                  value={formData.timeOfBirth}
                  onChange={(e) => setFormData({...formData, timeOfBirth: e.target.value})}
                  disabled={formData.timeUnknown}
                  className="flex-1 rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none transition focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
                <div className="flex items-center gap-2 min-w-fit">
                  <input
                    type="checkbox"
                    id="timeUnknown"
                    checked={formData.timeUnknown}
                    onChange={(e) => setFormData({...formData, timeUnknown: e.target.checked, timeOfBirth: ""})}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="timeUnknown" className="text-sm text-gray-600 dark:text-gray-400">
                    Unknown
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-base font-semibold text-black dark:text-white">
                <MapPin className="h-5 w-5" />
                Place of Birth
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleLocationSearch(e.target.value)}
                  placeholder="Search for a city"
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none transition focus:border-primary focus:ring-1 focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  required
                />
                {locations.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-boxdark border border-stroke rounded-lg max-h-60 overflow-y-auto">
                    {locations.map((location, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            placeOfBirth: location.name,
                            longitude: location.longitude,
                            latitude: location.latitude
                          });
                          setSearchTerm(location.name);
                          setLocations([]);
                        }}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-meta-4 cursor-pointer border-b border-stroke last:border-0"
                      >
                        {location.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-base font-semibold text-black dark:text-white">
                <Users className="h-5 w-5" />
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 px-6 text-black outline-none transition focus:border-primary focus:ring-1 focus:ring-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                required
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary py-4 px-6 text-base font-semibold text-white transition duration-300 hover:bg-primary/80 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdditionalDetails;