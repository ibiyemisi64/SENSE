import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie'

export function Testing() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const username = "jasonsilva2202@gmail.com";
    const accessToken = "tLvbPtPAchOwVrKdKoRevoSH";
    const serverUrl = "https://sherpa.cs.brown.edu:3336";

    async function fetchData() {
      try {
        // Login request
        const loginResponse = await fetch(`${serverUrl}/rest/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            accesstoken: accessToken,
          }),
        });

        const loginData = await loginResponse.json();
        Cookies.set('session', loginData.session)

        if (loginData.status !== "OK") {
          throw new Error(loginData.message || "Login failed");
        }

        // Request to /rest/signs
        const signsResponse = await fetch(`${serverUrl}/rest/signs?session=${Cookies.get('session')}`, {
          method: "GET",
        });

        if (!signsResponse.ok) {
          throw new Error("Failed to fetch signs");
        }

        const signsData = await signsResponse.json();
        setData(signsData);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : "Loading..."}
    </div>
  );
}

export default Testing;
