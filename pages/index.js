import Link from "next/link";
import { useState } from "react";

export default function FormLanding() {
  const [ticket, setTicket] = useState("");

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Choose Form Type</h2>
      <p>Enter Autotask Ticket Number:</p>
      <input
        type="text"
        value={ticket}
        onChange={(e) => setTicket(e.target.value)}
        placeholder="Enter Ticket Number"
        style={{ width: "100%", marginBottom: "1rem" }}
      />

      <Link href={`/form/single-day?ticket=${ticket}`} legacyBehavior>
        <button style={{ width: "100%", marginBottom: "1rem" }}>Single-Day Sign-Off</button>
      </Link>

      <Link href={`/form/multi-day?ticket=${ticket}`} legacyBehavior>
        <button style={{ width: "100%" }}>Multi-Day Work Order</button>
      </Link>
    </div>
  );
}
