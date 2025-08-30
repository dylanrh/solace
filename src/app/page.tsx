"use client";

import { useEffect, useState } from "react";

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
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term">{search}</span>
        </p>
        <input
          style={{ border: "1px solid black" }}
          placeholder="Search advocates..."
          value={search}
          onChange={onChange}
        />
        <button onClick={reset}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <th>First Name</th>
          <th>Last Name</th>
          <th>City</th>
          <th>Degree</th>
          <th>Specialties</th>
          <th>Years of Experience</th>
          <th>Phone Number</th>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate, index) => {
            return (
              <tr key={index}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s) => (
                    <div key={s}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
