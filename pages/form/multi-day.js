import { useState, useEffect, useRef } from "react";
import supabase from "../../lib/supabaseClient";

export default function MultiDayForm() {
  const [ticket, setTicket] = useState("");
  const [entries, setEntries] = useState([
    { day: 1, date: "", start_time: "", end_time: "", summary: "" },
  ]);
  const [expenses, setExpenses] = useState({ parking: "", tolls: "", materials: "" });
  const canvasRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ticketParam = params.get("ticket");
    if (ticketParam) setTicket(ticketParam);
  }, []);

  const getSignatureImage = () => canvasRef.current.toDataURL("image/png");

  const handleSubmit = async () => {
    const payload = {
      ticket,
      work_log: entries,
      expenses,
      customer_signature: getSignatureImage(),
    };

    const { data, error } = await supabase.from("job_submissions").insert([payload]);

    if (error) {
      console.error("❌ Submit Error:", error);
      alert("Failed to submit job form.");
    } else {
      alert("✅ Job submitted!");
    }
  };

  const addDay = () => {
    setEntries([
      ...entries,
      { day: entries.length + 1, date: "", start_time: "", end_time: "", summary: "" },
    ]);
  };

  const handleEntryChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Multi-Day Technician Job Form</h2>

      {entries.map((entry, idx) => (
        <div key={idx} style={{ borderBottom: "1px solid #eee", marginBottom: "1rem" }}>
          <h4>Day {entry.day}</h4>

          <label htmlFor={`date-${idx}`}>Date</label>
          <input id={`date-${idx}`} type="date" value={entry.date} onChange={(e) => handleEntryChange(idx, "date", e.target.value)} /><br />

          <label htmlFor={`start-${idx}`}>Start Time</label>
          <input id={`start-${idx}`} type="time" value={entry.start_time} onChange={(e) => handleEntryChange(idx, "start_time", e.target.value)} /><br />

          <label htmlFor={`end-${idx}`}>End Time</label>
          <input id={`end-${idx}`} type="time" value={entry.end_time} onChange={(e) => handleEntryChange(idx, "end_time", e.target.value)} /><br />

          <label htmlFor={`summary-${idx}`}>Work Summary</label><br />
          <textarea
            id={`summary-${idx}`}
            rows={3}
            value={entry.summary}
            onChange={(e) => handleEntryChange(idx, "summary", e.target.value)}
            style={{ width: "100%" }}
          /><br />
        </div>
      ))}

      <button type="button" onClick={addDay}>Add Day</button><br /><br />

      <label htmlFor="parking">Parking ($)</label>
      <input id="parking" type="number" value={expenses.parking} onChange={(e) => setExpenses({ ...expenses, parking: e.target.value })} /><br />

      <label htmlFor="tolls">Tolls ($)</label>
      <input id="tolls" type="number" value={expenses.tolls} onChange={(e) => setExpenses({ ...expenses, tolls: e.target.value })} /><br />

      <label htmlFor="materials">Materials ($)</label>
      <input id="materials" type="number" value={expenses.materials} onChange={(e) => setExpenses({ ...expenses, materials: e.target.value })} /><br /><br />

      <label htmlFor="signature">Customer Signature</label><br />
      <canvas ref={canvasRef} id="signature" width={500} height={200} style={{ border: "1px solid black" }} /><br /><br />

      <button type="button" onClick={handleSubmit}>Submit</button>
    </div>
  );
}
