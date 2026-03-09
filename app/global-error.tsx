"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "1rem",
            textAlign: "center",
            fontFamily: "sans-serif",
            backgroundColor: "#0b1118",
            color: "#e5edf7",
          }}
        >
          <p style={{ color: "#22c1a4", fontSize: "0.875rem", fontWeight: 500 }}>
            Something went wrong
          </p>
          <h1 style={{ marginTop: "0.75rem", fontSize: "1.875rem", fontWeight: 700 }}>
            A critical error occurred
          </h1>
          <p style={{ marginTop: "1rem", color: "#94a3b8", fontSize: "0.875rem" }}>
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.625rem 1.25rem",
              backgroundColor: "#22c1a4",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
