const students = [];
let filteredStudents = [];
let sortOrder = null;

const fullnameInput = document.getElementById("fullname");
const scoreInput = document.getElementById("score");
const addBtn = document.getElementById("addBtn");
const searchInput = document.getElementById("searchInput");
const filterRank = document.getElementById("filterRank");
const scoreHeader = document.getElementById("scoreHeader");
const tableBody = document.getElementById("studentTableBody");
const noResult = document.getElementById("noResult");
const stats = document.getElementById("stats");

function getRank(score) {
  if (score >= 8.5) return "Giỏi";
  if (score >= 7) return "Khá";
  if (score >= 5) return "Trung bình";
  return "Yếu";
}

function addStudent() {
  const fullname = fullnameInput.value.trim();
  const score = Number(scoreInput.value);

  if (fullname === "") {
    alert("Họ tên không được để trống!");
    return;
  }

  if (isNaN(score) || score < 0 || score > 10) {
    alert("Điểm phải từ 0 đến 10!");
    return;
  }

  students.push({ fullname, score });

  fullnameInput.value = "";
  scoreInput.value = "";
  fullnameInput.focus();

  applyFilters();
}

function applyFilters() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedRank = filterRank.value;

  filteredStudents = students.filter(student => {
    const matchName = student.fullname.toLowerCase().includes(keyword);
    const rank = getRank(student.score);
    const matchRank = selectedRank === "Tất cả" || rank === selectedRank;
    return matchName && matchRank;
  });

  if (sortOrder === "asc") {
    filteredStudents.sort((a, b) => a.score - b.score);
  } else if (sortOrder === "desc") {
    filteredStudents.sort((a, b) => b.score - a.score);
  }

  renderTable();
}

function renderTable() {
  tableBody.innerHTML = "";

  if (filteredStudents.length === 0) {
    noResult.style.display = "block";
  } else {
    noResult.style.display = "none";
  }

  filteredStudents.forEach((student, index) => {
    const tr = document.createElement("tr");

    if (student.score < 5) {
      tr.classList.add("low-score");
    }

    const originalIndex = students.indexOf(student);

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.fullname}</td>
      <td>${student.score}</td>
      <td>${getRank(student.score)}</td>
      <td>
        <button class="delete-btn" data-index="${originalIndex}">Xóa</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  updateStats();
  updateSortArrow();
}

function updateStats() {
  const total = filteredStudents.length;
  let avg = 0;

  if (total > 0) {
    const sum = filteredStudents.reduce((acc, student) => acc + student.score, 0);
    avg = (sum / total).toFixed(2);
  }

  stats.textContent = `Tổng số sinh viên đang hiển thị: ${total} | Điểm trung bình: ${avg}`;
}

function updateSortArrow() {
  if (sortOrder === "asc") {
    scoreHeader.textContent = "Điểm ▲";
  } else if (sortOrder === "desc") {
    scoreHeader.textContent = "Điểm ▼";
  } else {
    scoreHeader.textContent = "Điểm";
  }
}

addBtn.addEventListener("click", addStudent);

scoreInput.addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
    addStudent();
  }
});

searchInput.addEventListener("input", applyFilters);
filterRank.addEventListener("change", applyFilters);

scoreHeader.addEventListener("click", function() {
  if (sortOrder === null) {
    sortOrder = "asc";
  } else if (sortOrder === "asc") {
    sortOrder = "desc";
  } else {
    sortOrder = "asc";
  }

  applyFilters();
});

tableBody.addEventListener("click", function(event) {
  if (event.target.classList.contains("delete-btn")) {
    const index = Number(event.target.dataset.index);
    students.splice(index, 1);
    applyFilters();
  }
});