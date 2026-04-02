const form = document.getElementById("registerForm");

const fullname = document.getElementById("fullname");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");
const successMessage = document.getElementById("successMessage");

function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + "Error");

  if (input) {
    input.classList.add("invalid");
    input.classList.remove("valid");
  }

  if (error) {
    error.textContent = message;
  }
}

function clearError(fieldId) {
  const input = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + "Error");

  if (input) {
    input.classList.remove("invalid");
    input.classList.add("valid");
  }

  if (error) {
    error.textContent = "";
  }
}

function showGroupError(errorId, message) {
  document.getElementById(errorId).textContent = message;
}

function clearGroupError(errorId) {
  document.getElementById(errorId).textContent = "";
}

function validateFullname() {
  const value = fullname.value.trim();
  const regex = /^[a-zA-ZÀ-ỹ\s]+$/;

  if (value === "") {
    showError("fullname", "Họ và tên không được để trống");
    return false;
  }

  if (value.length < 3) {
    showError("fullname", "Họ và tên phải có ít nhất 3 ký tự");
    return false;
  }

  if (!regex.test(value)) {
    showError("fullname", "Họ và tên chỉ được chứa chữ cái và khoảng trắng");
    return false;
  }

  clearError("fullname");
  return true;
}

function validateEmail() {
  const value = email.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value === "") {
    showError("email", "Email không được để trống");
    return false;
  }

  if (!regex.test(value)) {
    showError("email", "Email không đúng định dạng");
    return false;
  }

  clearError("email");
  return true;
}

function validatePhone() {
  const value = phone.value.trim();
  const regex = /^0[0-9]{9}$/;

  if (value === "") {
    showError("phone", "Số điện thoại không được để trống");
    return false;
  }

  if (!regex.test(value)) {
    showError("phone", "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0");
    return false;
  }

  clearError("phone");
  return true;
}

function validatePassword() {
  const value = password.value;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (value === "") {
    showError("password", "Mật khẩu không được để trống");
    return false;
  }

  if (!regex.test(value)) {
    showError("password", "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số");
    return false;
  }

  clearError("password");
  return true;
}

function validateConfirmPassword() {
  const value = confirmPassword.value;

  if (value === "") {
    showError("confirmPassword", "Vui lòng nhập lại mật khẩu");
    return false;
  }

  if (value !== password.value) {
    showError("confirmPassword", "Mật khẩu xác nhận không khớp");
    return false;
  }

  clearError("confirmPassword");
  return true;
}

function validateGender() {
  const gender = document.querySelector('input[name="gender"]:checked');

  if (!gender) {
    showGroupError("genderError", "Vui lòng chọn giới tính");
    return false;
  }

  clearGroupError("genderError");
  return true;
}

function validateTerms() {
  if (!terms.checked) {
    showGroupError("termsError", "Bạn phải đồng ý với điều khoản");
    return false;
  }

  clearGroupError("termsError");
  return true;
}

fullname.addEventListener("blur", validateFullname);
email.addEventListener("blur", validateEmail);
phone.addEventListener("blur", validatePhone);
password.addEventListener("blur", validatePassword);
confirmPassword.addEventListener("blur", validateConfirmPassword);

fullname.addEventListener("input", () => {
  document.getElementById("fullnameError").textContent = "";
  fullname.classList.remove("invalid");
});

email.addEventListener("input", () => {
  document.getElementById("emailError").textContent = "";
  email.classList.remove("invalid");
});

phone.addEventListener("input", () => {
  document.getElementById("phoneError").textContent = "";
  phone.classList.remove("invalid");
});

password.addEventListener("input", () => {
  document.getElementById("passwordError").textContent = "";
  password.classList.remove("invalid");
});

confirmPassword.addEventListener("input", () => {
  document.getElementById("confirmPasswordError").textContent = "";
  confirmPassword.classList.remove("invalid");
});

document.querySelectorAll('input[name="gender"]').forEach(radio => {
  radio.addEventListener("change", () => clearGroupError("genderError"));
});

terms.addEventListener("change", () => clearGroupError("termsError"));

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const isValid =
    validateFullname() &
    validateEmail() &
    validatePhone() &
    validatePassword() &
    validateConfirmPassword() &
    validateGender() &
    validateTerms();

  if (isValid) {
    form.style.display = "none";
    successMessage.style.display = "block";
    successMessage.textContent = `Đăng ký thành công! 🎉 Xin chào, ${fullname.value.trim()}!`;
  }
});