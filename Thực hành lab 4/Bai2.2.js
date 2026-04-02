const prices = {
  "Áo": 150000,
  "Quần": 200000,
  "Giày": 500000
};

const form = document.getElementById("orderForm");
const product = document.getElementById("product");
const quantity = document.getElementById("quantity");
const deliveryDate = document.getElementById("deliveryDate");
const address = document.getElementById("address");
const note = document.getElementById("note");
const noteCounter = document.getElementById("noteCounter");
const totalPrice = document.getElementById("totalPrice");
const summaryBox = document.getElementById("summaryBox");
const summaryContent = document.getElementById("summaryContent");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const successBox = document.getElementById("successBox");

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

function showGroupError(id, message) {
  document.getElementById(id).textContent = message;
}

function clearGroupError(id) {
  document.getElementById(id).textContent = "";
}

function validateProduct() {
  if (product.value === "") {
    showError("product", "Vui lòng chọn sản phẩm");
    return false;
  }
  clearError("product");
  return true;
}

function validateQuantity() {
  const value = Number(quantity.value);

  if (!Number.isInteger(value) || value < 1 || value > 99) {
    showError("quantity", "Số lượng phải là số nguyên từ 1 đến 99");
    return false;
  }
  clearError("quantity");
  return true;
}

function validateDeliveryDate() {
  const value = deliveryDate.value;

  if (value === "") {
    showError("deliveryDate", "Vui lòng chọn ngày giao hàng");
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = new Date(value);
  selectedDate.setHours(0, 0, 0, 0);

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);

  if (selectedDate < today) {
    showError("deliveryDate", "Ngày giao hàng không được ở quá khứ");
    return false;
  }

  if (selectedDate > maxDate) {
    showError("deliveryDate", "Ngày giao hàng không được quá 30 ngày từ hôm nay");
    return false;
  }

  clearError("deliveryDate");
  return true;
}

function validateAddress() {
  const value = address.value.trim();

  if (value === "") {
    showError("address", "Địa chỉ giao không được để trống");
    return false;
  }

  if (value.length < 10) {
    showError("address", "Địa chỉ giao phải có ít nhất 10 ký tự");
    return false;
  }

  clearError("address");
  return true;
}

function validateNote() {
  const value = note.value.trim();

  if (value.length > 200) {
    showError("note", "Ghi chú không được vượt quá 200 ký tự");
    return false;
  }

  clearError("note");
  return true;
}

function validatePayment() {
  const payment = document.querySelector('input[name="payment"]:checked');

  if (!payment) {
    showGroupError("paymentError", "Vui lòng chọn phương thức thanh toán");
    return false;
  }

  clearGroupError("paymentError");
  return true;
}

function updateNoteCounter() {
  const length = note.value.length;
  noteCounter.textContent = `${length}/200`;

  if (length > 200) {
    noteCounter.classList.add("over");
  } else {
    noteCounter.classList.remove("over");
  }
}

function updateTotalPrice() {
  const productName = product.value;
  const qty = Number(quantity.value);

  if (productName && qty > 0 && prices[productName]) {
    const total = prices[productName] * qty;
    totalPrice.textContent = `Tổng tiền: ${total.toLocaleString("vi-VN")} VNĐ`;
  } else {
    totalPrice.textContent = "Tổng tiền: 0 VNĐ";
  }
}

product.addEventListener("change", () => {
  validateProduct();
  updateTotalPrice();
});

quantity.addEventListener("input", () => {
  document.getElementById("quantityError").textContent = "";
  quantity.classList.remove("invalid");
  updateTotalPrice();
});

deliveryDate.addEventListener("blur", validateDeliveryDate);
address.addEventListener("blur", validateAddress);
note.addEventListener("blur", validateNote);

address.addEventListener("input", () => {
  document.getElementById("addressError").textContent = "";
  address.classList.remove("invalid");
});

note.addEventListener("input", () => {
  document.getElementById("noteError").textContent = "";
  note.classList.remove("invalid");
  updateNoteCounter();
  validateNote();
});

document.querySelectorAll('input[name="payment"]').forEach(radio => {
  radio.addEventListener("change", () => clearGroupError("paymentError"));
});

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const isValid =
    validateProduct() &
    validateQuantity() &
    validateDeliveryDate() &
    validateAddress() &
    validateNote() &
    validatePayment();

  if (isValid) {
    const productName = product.value;
    const qty = Number(quantity.value);
    const total = prices[productName] * qty;
    const payment = document.querySelector('input[name="payment"]:checked').value;

    summaryContent.innerHTML = `
      <p><strong>Sản phẩm:</strong> ${productName}</p>
      <p><strong>Số lượng:</strong> ${qty}</p>
      <p><strong>Tổng tiền:</strong> ${total.toLocaleString("vi-VN")} VNĐ</p>
      <p><strong>Ngày giao:</strong> ${deliveryDate.value}</p>
      <p><strong>Địa chỉ:</strong> ${address.value.trim()}</p>
      <p><strong>Thanh toán:</strong> ${payment}</p>
    `;

    summaryBox.style.display = "block";
  }
});

confirmBtn.addEventListener("click", function() {
  summaryBox.style.display = "none";
  form.style.display = "none";
  successBox.style.display = "block";
});

cancelBtn.addEventListener("click", function() {
  summaryBox.style.display = "none";
});