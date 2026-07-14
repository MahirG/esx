"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Load the enterprise HTML into the iframe via srcdoc
    const loadHTML = async () => {
      try {
        const res = await fetch("/hisab-erp-enterprise.html");
        const html = await res.text();
        if (iframeRef.current) {
          iframeRef.current.srcdoc = html;
        }
      } catch (err) {
        console.error("Failed to load Hisab ERP:", err);
      }
    };
    loadHTML();
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#0B141A" }}>
      <iframe
        ref={iframeRef}
        title="Hisab ERP — Ethiopian Business Intelligence"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        allow="camera; microphone"
      />
    </div>
  );
}
