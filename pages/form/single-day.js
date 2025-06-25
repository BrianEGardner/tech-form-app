import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SingleDaySignOffForm() {
  const router = useRouter();
  const { ticket } = router.query;

  const [technicianName, setTechnicianName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [workPerformed, setWorkPerformed] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [photos, setPhotos] = useState([]);
  const canvasRef = useRef(null);

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
      ticket_id: ticket,
      technician_name: technicianName,
      customer_name: customerName,
      work_summary: workPerformed,
      start_time: startTime,
      end_time: endTime,
      customer_signature: signature,
    };

    const { data, error } = await supabase.from("job_submissions").insert([payload]);

    if (error) {
      console.error("Error submitting job form:", error);
      alert("Failed to submit job form.");
    } else {
      alert("Job form submitted successfully.");
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
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Single-Day Job Sign-Off</h2>

      <label>Technician Name</label><br />
      <input type="text" value={technicianName} onChange={(e) => setTechnicianName(e.target.value)} /><br /><br />

      <label>Customer Name</label><br />
      <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} /><br /><br />

      <label>Work Performed</label><br />
      <textarea value={workPerformed} onChange={(e) => setWorkPerformed(e.target.value)} rows={4} style={{ width: "100%" }} /><br /><br />

      <label>Start Time</label><br />
      <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} /><br /><br />

      <label>End Time</label><br />
      <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} /><br /><br />

      <label>Upload Photos</label><br />
      <input type="file" multiple onChange={handlePhotoUpload} /><br /><br />

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

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
