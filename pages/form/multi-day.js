import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function MultiDayWorkOrderForm() {
  const router = useRouter();
  const { ticket } = router.query;

  const [entries, setEntries] = useState([
    { date: "", timeOnSite: "", workDone: "", materialsUsed: "" },
  ]);
  const canvasRef = useRef(null);

  const addEntry = () => {
    setEntries([...entries, { date: "", timeOnSite: "", workDone: "", materialsUsed: "" }]);
  };

  const updateEntry = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const getSignatureImage = () => {
    const canvas = canvasRef.current;
    return canvas.toDataURL("image/png");
  };

  const handleSubmit = async () => {
    const signature = getSignatureImage();

    const payload = {
      ticket_id: ticket,
      work_log: entries,
      customer_signature: signature,
    };

    const { data, error } = await supabase.from("job_submissions").insert([payload]);

    if (error) {
      console.error("Error submitting work order:", error);
      alert("Failed to submit work order.");
    } else {
      alert("Work order submitted successfully.");
      router.push("/");
    }
  };

  const handleDraw = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const startDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    canvas.addEventListener("mousemove", handleDraw);
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    canvas.removeEventListener("mousemove", handleDraw);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Multi-Day Work Order</h2>

      {entries.map((entry, index) => (
        <div key={index} style={{ marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid #ddd" }}>
          <h4>Entry {index + 1}</h4>
          <label>Date</label><br />
          <input type="date" value={entry.date} onChange={(e) => updateEntry(index, "date", e.target.value)} /><br /><br />

          <label>Time On Site</label><br />
          <input type="text" value={entry.timeOnSite} onChange={(e) => updateEntry(index, "timeOnSite", e.target.value)} /><br /><br />

          <label>Work Done</label><br />
          <textarea value={entry.workDone} onChange={(e) => updateEntry(index, "workDone", e.target.value)} rows={3} style={{ width: "100%" }} /><br /><br />

          <label>Materials Used</label><br />
          <textarea value={entry.materialsUsed} onChange={(e) => updateEntry(index, "materialsUsed", e.target.value)} rows={2} style={{ width: "100%" }} /><br /><br />
        </div>
      ))}

      <button type="button" onClick={addEntry} style={{ marginBottom: "1.5rem" }}>Add Another Day</button><br />

      <label>Customer Signature (Draw Below)</label><br />
      <canvas
        ref={canvasRef}
        width={500}
        height={200}
        style={{ border: "1px solid black" }}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
      /><br />
      <button type="button" onClick={clearCanvas}>Clear Signature</button><br /><br />

      <button onClick={handleSubmit}>Submit Work Order</button>
    </div>
  );
}
