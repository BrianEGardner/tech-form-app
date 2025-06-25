import { useState, useRef, useEffect } from "react";
import supabase from "../../lib/supabaseClient";

export default function SingleDayForm() {
  const [ticket, setTicket] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [workSummary, setWorkSummary] = useState("");
  const [photos, setPhotos] = useState([]);
  const [expenses, setExpenses] = useState({ parking: "", tolls: "", materials: "" });
  const canvasRef = useRef(null);

  const getTicketFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("ticket") || "";
  };

  useEffect(() => {
    const urlTicket = getTicketFromURL();
    setTicket(urlTicket);
  }, []);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

  const getSignatureImage = () => {
    const canvas = canvasRef.current;
    return canvas.toDataURL("image/png");
  };

  const handleSubmit = async () => {
    const signature = getSignatureImage();

    const payload = {
      ticket,
      start_time: startTime,
      end_time: endTime,
      work_summary: workSummary,
      expenses,
      customer_signature: signature,
    };

    const { data, error } = await supabase.from("job_submissions").insert([payload]);

    if (error) {
      console.error("❌ Error submitting job form:", error);
      alert("Failed to submit job form.");
    } else {
      console.log("✅ Job form submitted:", data);
      alert("Job form submitted successfully.");
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
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Single-Day Job Form</h2>

      <label htmlFor="ticket">Ticket Number</label>
      <input id="ticket" name="ticket" type="text" value={ticket} onChange={(e) => setTicket(e.target.value)} /><br /><br />

      <label htmlFor="start_time">Start Time</label>
      <input id="start_time" name="start_time" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} /><br /><br />

      <label htmlFor="end_time">End Time</label>
      <input id="end_time" name="end_time" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} /><br /><br />

      <label htmlFor="work_summary">Work Summary</label>
      <textarea id="work_summary" name="work_summary" value={workSummary} onChange={(e) => setWorkSummary(e.target.value)} rows={5} style={{ width: "100%" }} /><br /><br />

      <label htmlFor="photos">Photos</label>
      <input id="photos" name="photos" type="file" multiple onChange={handlePhotoUpload} /><br /><br />

      <label htmlFor="parking">Parking ($)</label>
      <input id="parking" name="parking" type="number" value={expenses.parking} onChange={(e) => setExpenses({ ...expenses, parking: e.target.value })} /><br /><br />

      <label htmlFor="tolls">Tolls ($)</label>
      <input id="tolls" name="tolls" type="number" value={expenses.tolls} onChange={(e) => setExpenses({ ...expenses, tolls: e.target.value })} /><br /><br />

      <label htmlFor="materials">Materials ($)</label>
      <input id="materials" name="materials" type="number" value={expenses.materials} onChange={(e) => setExpenses({ ...expenses, materials: e.target.value })} /><br /><br />

      <label htmlFor="signature">Customer Signature (Draw below)</label><br />
      <canvas
        ref={canvasRef}
        id="signature"
        width={500}
        height={200}
        style={{ border: "1px solid black" }}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
      />
      <button type="button" onClick={clearCanvas}>Clear Signature</button><br /><br />

      <button type="button" onClick={handleSubmit}>Submit Job Form</button>
    </div>
  );
}
