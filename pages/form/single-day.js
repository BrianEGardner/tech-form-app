import { useState, useRef, useEffect } from "react";
import supabase from "../../lib/supabaseClient";

export default function SingleDayForm() {
  const [ticket, setTicket] = useState("");
  const [technician, setTechnician] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [workSummary, setWorkSummary] = useState("");
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
      technician,
      customer_name: customerName,
      start_time: startTime,
      end_time: endTime,
      work_summary: workSummary,
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

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Single-Day Technician Job Form</h2>

      <label htmlFor="technician">Technician Name</label>
      <input id="technician" value={technician} onChange={(e) => setTechnician(e.target.value)} /><br /><br />

      <label htmlFor="customerName">Customer Name</label>
      <input id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} /><br /><br />

      <label htmlFor="startTime">Start Time</label>
      <input id="startTime" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} /><br /><br />

      <label htmlFor="endTime">End Time</label>
      <input id="endTime" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} /><br /><br />

      <label htmlFor="workSummary">Work Summary</label>
      <textarea id="workSummary" value={workSummary} onChange={(e) => setWorkSummary(e.target.value)} rows={5} style={{ width: "100%" }} /><br /><br />

      <label htmlFor="signature">Customer Signature</label><br />
      <canvas ref={canvasRef} id="signature" width={500} height={200} style={{ border: "1px solid black" }} /><br /><br />

      <button type="button" onClick={handleSubmit}>Submit</button>
    </div>
  );
}
