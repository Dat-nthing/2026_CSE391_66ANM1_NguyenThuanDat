const STORAGE_KEY = 'students';

function getStudents() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveStudents(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function setMessage(elementId, text, type = 'success') {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.textContent = text;
  element.className = `message ${type === 'success' ? 'success' : 'error-box'}`;
  element.classList.remove('hidden');
}

function clearMessage(elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.textContent = '';
  element.className = 'message hidden';
}

function setError(fieldId, message) {
  const errorElement = document.getElementById(`${fieldId}Error`);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearErrors() {
  [
    'studentId',
    'fullName',
    'dateOfBirth',
    'className',
    'gpa',
    'email',
    'password',
    'confirmPassword'
  ].forEach((field) => setError(field, ''));
}

function normalizeName(name) {
  return name.replace(/\s+/g, ' ').trim();
}

function isAtLeast18(dateString) {
  const dob = new Date(dateString);
  if (Number.isNaN(dob.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age >= 18;
}

function formatDate(dateString) {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

function calculateAverageGpa(students) {
  if (!students.length) return '0.00';
  const total = students.reduce((sum, student) => sum + Number(student.gpa), 0);
  return (total / students.length).toFixed(2);
}

function updateSummary(students) {
  document.getElementById('totalStudents').textContent = students.length;
  document.getElementById('averageGpa').textContent = calculateAverageGpa(students);
}

function resetForm() {
  const form = document.getElementById('studentForm');
  if (!form) return;

  form.reset();
  document.getElementById('editingStudentId').value = '';
  document.getElementById('modalTitle').textContent = 'Thêm/Sửa Sinh Viên';
  document.getElementById('studentId').readOnly = false;
  clearErrors();
  clearMessage('formMessage');
}

function openModal(isEdit = false) {
  const modal = document.getElementById('studentModal');
  if (!modal) return;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('modalTitle').textContent = isEdit ? 'Chỉnh Sửa Sinh Viên' : 'Thêm/Sửa Sinh Viên';
}

function closeModal() {
  const modal = document.getElementById('studentModal');
  if (!modal) return;

  modal.classList.add('hidden');
  document.body.style.overflow = '';
  resetForm();
}

function validateStudentForm(studentData) {
  clearErrors();
  let isValid = true;

  const studentIdRegex = /^SV\d{6}$/;
  const fullNameRegex = /^[A-Za-zÀ-ỹ\s]+$/u;
  const gpaRegex = /^(10|\d)(\.\d{1,2})?$/;
  const emailRegex = /^[A-Za-z0-9._%+-]+@student\.edu\.vn$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  if (!studentData.studentId.trim()) {
    setError('studentId', 'Mã sinh viên không được để trống.');
    isValid = false;
  } else if (!studentIdRegex.test(studentData.studentId.trim())) {
    setError('studentId', 'Mã sinh viên phải bắt đầu bằng SV và có 6 chữ số.');
    isValid = false;
  }

  if (!studentData.fullName.trim()) {
    setError('fullName', 'Họ và tên không được để trống.');
    isValid = false;
  } else if (!fullNameRegex.test(studentData.fullName)) {
    setError('fullName', 'Họ và tên chỉ được chứa chữ cái và khoảng trắng.');
    isValid = false;
  }

  if (!studentData.dateOfBirth) {
    setError('dateOfBirth', 'Ngày sinh không được để trống.');
    isValid = false;
  } else if (!isAtLeast18(studentData.dateOfBirth)) {
    setError('dateOfBirth', 'Sinh viên phải từ 18 tuổi trở lên.');
    isValid = false;
  }

  if (!studentData.className) {
    setError('className', 'Vui lòng chọn lớp học.');
    isValid = false;
  }

  if (studentData.gpa === '') {
    setError('gpa', 'Điểm trung bình không được để trống.');
    isValid = false;
  } else if (!gpaRegex.test(studentData.gpa) || Number(studentData.gpa) < 0 || Number(studentData.gpa) > 10) {
    setError('gpa', 'Điểm trung bình phải từ 0 đến 10 và tối đa 2 chữ số thập phân.');
    isValid = false;
  }

  if (!studentData.email.trim()) {
    setError('email', 'Email sinh viên không được để trống.');
    isValid = false;
  } else if (!emailRegex.test(studentData.email.trim())) {
    setError('email', 'Email phải đúng định dạng và kết thúc bằng @student.edu.vn.');
    isValid = false;
  }

  if (!studentData.password) {
    setError('password', 'Mật khẩu không được để trống.');
    isValid = false;
  } else if (!passwordRegex.test(studentData.password)) {
    setError('password', 'Mật khẩu cần ít nhất 8 ký tự, gồm hoa, thường, số và ký tự đặc biệt.');
    isValid = false;
  }

  if (!studentData.confirmPassword) {
    setError('confirmPassword', 'Xác nhận mật khẩu không được để trống.');
    isValid = false;
  } else if (studentData.confirmPassword !== studentData.password) {
    setError('confirmPassword', 'Xác nhận mật khẩu phải khớp với mật khẩu.');
    isValid = false;
  }

  return isValid;
}

function renderStudents(keyword = '') {
  const tbody = document.getElementById('studentTableBody');
  if (!tbody) return;

  const students = getStudents();
  updateSummary(students);

  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredStudents = students.filter((student) => {
    return (
      student.studentId.toLowerCase().includes(normalizedKeyword) ||
      student.fullName.toLowerCase().includes(normalizedKeyword) ||
      student.className.toLowerCase().includes(normalizedKeyword) ||
      student.email.toLowerCase().includes(normalizedKeyword)
    );
  });

  if (!filteredStudents.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">Chưa có sinh viên nào phù hợp.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredStudents
    .map((student, index) => {
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${student.studentId}</td>
          <td>${student.fullName}</td>
          <td>${formatDate(student.dateOfBirth)}</td>
          <td>${student.className}</td>
          <td>${Number(student.gpa).toFixed(2)}</td>
          <td>${student.email}</td>
          <td>
            <div class="action-group">
              <button class="btn btn-edit" onclick="editStudent('${student.studentId}')">Sửa</button>
              <button class="btn btn-delete" onclick="deleteStudent('${student.studentId}')">Xóa</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

function editStudent(studentId) {
  const student = getStudents().find((item) => item.studentId === studentId);
  if (!student) return;

  document.getElementById('editingStudentId').value = student.studentId;
  document.getElementById('studentId').value = student.studentId;
  document.getElementById('studentId').readOnly = true;
  document.getElementById('fullName').value = student.fullName;
  document.getElementById('dateOfBirth').value = student.dateOfBirth;
  document.getElementById('className').value = student.className;
  document.getElementById('gpa').value = student.gpa;
  document.getElementById('email').value = student.email;
  document.getElementById('password').value = student.password;
  document.getElementById('confirmPassword').value = student.password;

  clearErrors();
  clearMessage('formMessage');
  openModal(true);
}

function deleteStudent(studentId) {
  const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa sinh viên này không?');
  if (!isConfirmed) return;

  const students = getStudents().filter((student) => student.studentId !== studentId);
  saveStudents(students);
  renderStudents(document.getElementById('keyword')?.value || '');
  setMessage('listMessage', 'Xóa sinh viên thành công.', 'success');
}

function handleStudentForm() {
  const form = document.getElementById('studentForm');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearMessage('formMessage');

    const editingStudentId = document.getElementById('editingStudentId').value;

    const studentData = {
      studentId: document.getElementById('studentId').value.trim(),
      fullName: normalizeName(document.getElementById('fullName').value),
      dateOfBirth: document.getElementById('dateOfBirth').value,
      className: document.getElementById('className').value,
      gpa: document.getElementById('gpa').value.trim(),
      email: document.getElementById('email').value.trim().toLowerCase(),
      password: document.getElementById('password').value,
      confirmPassword: document.getElementById('confirmPassword').value
    };

    if (!validateStudentForm(studentData)) {
      setMessage('formMessage', 'Vui lòng kiểm tra lại dữ liệu trong form.', 'error');
      return;
    }

    const students = getStudents();
    const isDuplicate = students.some(
      (student) => student.studentId === studentData.studentId && student.studentId !== editingStudentId
    );

    if (isDuplicate) {
      setError('studentId', 'Mã sinh viên đã tồn tại.');
      setMessage('formMessage', 'Mã sinh viên đã tồn tại trong hệ thống.', 'error');
      return;
    }

    const finalStudent = {
      studentId: studentData.studentId,
      fullName: studentData.fullName,
      dateOfBirth: studentData.dateOfBirth,
      className: studentData.className,
      gpa: Number(studentData.gpa).toFixed(2),
      email: studentData.email,
      password: studentData.password
    };

    const existingIndex = students.findIndex((student) => student.studentId === editingStudentId);

    if (existingIndex >= 0) {
      students[existingIndex] = finalStudent;
    } else {
      students.push(finalStudent);
    }

    saveStudents(students);
    renderStudents(document.getElementById('keyword')?.value || '');
    closeModal();
    setMessage('listMessage', existingIndex >= 0 ? 'Cập nhật sinh viên thành công.' : 'Thêm sinh viên thành công.', 'success');
  });
}

function bindEvents() {
  document.getElementById('openAddModalBtn')?.addEventListener('click', function () {
    resetForm();
    openModal(false);
  });

  document.getElementById('closeModalBtn')?.addEventListener('click', closeModal);
  document.getElementById('closeModalOverlay')?.addEventListener('click', closeModal);
  document.getElementById('cancelBtn')?.addEventListener('click', closeModal);

  document.getElementById('keyword')?.addEventListener('input', function () {
    renderStudents(this.value);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
}

function seedSampleStudents() {
  const students = getStudents();
  if (students.length) return;

  const samples = [
    {
      studentId: 'SV123456',
      fullName: 'Nguyen Van A',
      dateOfBirth: '2000-01-15',
      className: 'A',
      gpa: '8.50',
      email: 'nguyenvana@student.edu.vn',
      password: 'Abc@1234'
    },
    {
      studentId: 'SV234567',
      fullName: 'Tran Thi B',
      dateOfBirth: '1999-05-20',
      className: 'B',
      gpa: '9.00',
      email: 'tranthib@student.edu.vn',
      password: 'Abc@1234'
    },
    {
      studentId: 'SV345678',
      fullName: 'Le Van C',
      dateOfBirth: '2001-03-10',
      className: 'C',
      gpa: '7.80',
      email: 'levanc@student.edu.vn',
      password: 'Abc@1234'
    }
  ];

  saveStudents(samples);
}

document.addEventListener('DOMContentLoaded', function () {
  seedSampleStudents();
  bindEvents();
  handleStudentForm();
  renderStudents();
});