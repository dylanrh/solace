"use client";

import { useEffect, useState } from "react";

// Utility function to format phone numbers as XXX-XXX-XXXX
const formatPhoneNumber = (
  phone: string | number | null | undefined
): string => {
  if (!phone) return "";
  const digits = phone.toString().replace(/\D/g, ""); // remove non-digits
  if (digits.length !== 10) return phone.toString(); // fallback if not 10 digits
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export default function Home() {
  interface Advocate {
    firstName: string;
    lastName: string;
    city: string;
    degree: string;
    specialties: string[];
    yearsOfExperience: string | number;
    phoneNumber: string | number;
  }

  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  // Utility function to normalize strings and handle undefined/null values
  const norm = (v: unknown) => (v ?? "").toString().toLowerCase();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);
    // Grab the search term and convert to lowercase.  No need to use document.getElementById here, since we grab it from the only input element on the page. Below commented out and should be removed.
    // const searchTermElement = document.getElementById("search-term");
    // if (searchTermElement) {
    //   searchTermElement.innerHTML = searchTerm;
    // }

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        norm(advocate.firstName).includes(searchTerm) ||
        norm(advocate.lastName).includes(searchTerm) ||
        norm(advocate.city).includes(searchTerm) ||
        norm(advocate.degree).includes(searchTerm) ||
        (advocate.specialties ?? []).some((s) =>
          norm(s).includes(searchTerm)
        ) ||
        norm(advocate.yearsOfExperience).includes(searchTerm) ||
        norm(advocate.phoneNumber).includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const reset = () => {
    // console.log(advocates);
    setSearch("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Solace Advocates</h1>

      {/* Search Card */}
      <div className="card mb-6 space-y-3">
        <label className="block text-sm">Search</label>
        <input
          className="input"
          placeholder="Search advocates..."
          value={search}
          onChange={onChange}
        />
        <button onClick={reset} className="btn-primary w-fit">
          Reset Search
        </button>
      </div>
      <br />

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="table">
          <thead className="table-head">
            <tr>
              <th className="table-cell">First Name</th>
              <th className="table-cell">Last Name</th>
              <th className="table-cell">City</th>
              <th className="table-cell">Degree</th>
              <th className="table-cell">Specialties</th>
              <th className="table-cell">Years of Experience</th>
              <th className="table-cell">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate, index) => {
              return (
                <tr key={index} className="table-row">
                  <td className="table-cell">{advocate.firstName}</td>
                  <td className="table-cell">{advocate.lastName}</td>
                  <td className="table-cell">{advocate.city}</td>
                  <td className="table-cell">{advocate.degree}</td>
                  <td className="table-cell">
                    {advocate.specialties.map((s) => (
                      <div key={s}>{s}</div>
                    ))}
                  </td>
                  <td className="table-cell">{advocate.yearsOfExperience}</td>
                  <td className="table-cell">
                    {formatPhoneNumber(advocate.phoneNumber)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
