import { useState, useEffect, useRef } from "react";
import supabase from "../../lib/supabaseClient";

export default function SingleDayForm() {
  const [ticket, setTicket] = useState("");
  const [technician, setTechnician] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [workSummary, setWorkSummary] = useState("");
  const [expenses, setExpenses] = useState({ parking: "", tolls: "", materials: "" });

  const canvasRef = useRef(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ticketParam = params.get("ticket");
    if (ticketParam) setTicket(ticketParam);
  }, []);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    isDrawing.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const getSignatureImage = () => canvasRef.current.toDataURL("image/png");

  const handleSubmit = async () => {
    const payload = {
      ticket,
      technician,
      customer_name: customerName,
      start_time: startTime,
      end_time: endTime,
      work_summary: workSummary,
      expenses,
      customer_signature: getSignatureImage(),
    };

    const { data, error } = await supabase.from("job_submissions").insert([payload]);

    if (error) {
      console.error("❌ Submit Error:", error);
      alert("Failed to submit job form.");
    } else {
      alert("✅ Job submitted successfully!");
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

      <label htmlFor="workSummary">Work Summary</label><br />
      <textarea id="workSummary" rows={4} value={workSummary} onChange={(e) => setWorkSummary(e.target.value)} style={{ width: "100%" }} /><br /><br />

      <label htmlFor="parking">Parking ($)</label>
      <input id="parking" type="number" value={expenses.parking} onChange={(e) => setExpenses({ ...expenses, parking: e.target.value })} /><br />

      <label htmlFor="tolls">Tolls ($)</label>
      <input id="tolls" type="number" value={expenses.tolls} onChange={(e) => setExpenses({ ...expenses, tolls: e.target.value })} /><br />

      <label htmlFor="materials">Materials ($)</label>
      <input id="materials" type="number" value={expenses.materials} onChange={(e) => setExpenses({ ...expenses, materials: e.target.value })} /><br /><br />

      <label htmlFor="signature">Customer Signature</label><br />
      <canvas
        id="signature"
        ref={canvasRef}
        width={500}
        height={200}
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      /><br />
      <button type="button" onClick={clearSignature}>Clear Signature</button><br /><br />

      <button type="button" onClick={handleSubmit}>Submit Job Form</button>
    </div>
  );
}
