"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

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

  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") ?? "";
  const limit = 50;
  const offset = Number(searchParams.get("offset") ?? 0);

  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [search, setSearch] = useState(q);

  useEffect(() => {
    const url = new URL("/api/advocates", window.location.origin);
    if (q) url.searchParams.set("q", q);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));

    fetch(url.toString())
      .then((response) => response.json())
      .then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
  }, [q, offset]);

  // Utility function to normalize strings and handle undefined/null values
  const norm = (v: unknown) => (v ?? "").toString().toLowerCase();

  // only update input. Search happens on button/Enter
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // write q to URL and reset offset when searching
  const applySearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    const next = search.trim();
    if (next) params.set("q", next);
    else params.delete("q");
    params.set("offset", "0");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // clear input and URL
  const reset = () => {
    setSearch("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    params.set("offset", "0");
    router.replace(`?${params.toString()}`, { scroll: false });
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              applySearch();
            }
          }}
        />
        <div className="flex gap-2">
          <button onClick={applySearch} className="btn-primary w-fit">
            Apply Search
          </button>
          <button onClick={reset} className="btn-primary w-fit">
            Reset Search
          </button>
        </div>
      </div>

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
