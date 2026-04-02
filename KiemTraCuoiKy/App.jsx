import { useState, useEffect } from "react";
import duLieu from "./data.js";
import FormConference from "./components/FormConference";
import ListConferences from "./components/ListConferences";

function App() {
  const [hienForm, setHienForm] = useState(false);

  const [conferences, setConferences] = useState(() => {
    const duLieuLuu = localStorage.getItem("conferences");
    return duLieuLuu ? JSON.parse(duLieuLuu) : duLieu;
  });

  const [tuKhoa, setTuKhoa] = useState("");
  const [locLoai, setLocLoai] = useState("");

  useEffect(() => {
    localStorage.setItem("conferences", JSON.stringify(conferences));
  }, [conferences]);

  const themHoiNghi = (conf) => {
    setConferences([...conferences, { ...conf, id: Date.now() }]);
    setHienForm(false);
  };

  // lọc dữ liệu
  const conferencesLoc = conferences.filter(item => {
    return (
      item.conferenceName.toLowerCase().includes(tuKhoa.toLowerCase()) &&
      (locLoai === "" || item.location === locLoai)
    );
  });

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Hub</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Trang chủ</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Quản lý Hội nghị</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Quản lý Hội nghị</h3>
          <button 
            className="btn btn-primary"
            onClick={() => setHienForm(true)}
          >
            + Thêm
          </button>
        </div>

        {/* FILTER */}
        <form className="row mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm theo tên hội nghị..."
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={locLoai}
              onChange={(e) => setLocLoai(e.target.value)}
            >
              <option value="">-- Lọc Location --</option>
              {["Online", "Hyderabad", "New York", "London", "Sydney"].map((loc, index) => (
                <option key={index} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </form>

        {/* LIST CONFERENCES */}
        <ListConferences
          conferencesLoc={conferencesLoc}
          themHoiNghi={themHoiNghi}
        />

        {/* FORM CONFERENCES */}
        {hienForm && (
          <FormConference
            setHienForm={setHienForm}
            themHoiNghi={themHoiNghi}
          />
        )}
      </div>
    </div>
  );
}

export default App;