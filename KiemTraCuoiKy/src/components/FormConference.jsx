import React, { useState } from "react";

const FormConference = ({ setHienForm, themHoiNghi }) => {
  const [conferenceName, setConferenceName] = useState("");
  const [speakers, setSpeakers] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    themHoiNghi({
      conferenceName,
      speakers: speakers.split(',').map(speaker => speaker.trim()),
      email,
      date: new Date(date),
      location
    });
    setHienForm(false);
  };

  return (
    <div className="modal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Thêm Hội nghị</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="conferenceName" className="form-label">Tên Hội nghị</label>
                <input type="text" className="form-control" id="conferenceName" value={conferenceName} onChange={(e) => setConferenceName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="speakers" className="form-label">Các Người Phát Triển</label>
                <input type="text" className="form-control" id="speakers" value={speakers} onChange={(e) => setSpeakers(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="date" className="form-label">Ngày</label>
                <input type="date" className="form-control" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="location" className="form-label">Location</label>
                <select className="form-select" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required>
                  <option value="">-- Chọn Location --</option>
                  <option value="Online">Online</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="New York">New York</option>
                  <option value="London">London</option>
                  <option value="Sydney">Sydney</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Lưu</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormConference;