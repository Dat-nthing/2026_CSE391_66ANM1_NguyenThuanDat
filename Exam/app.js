const STORAGE_KEY = 'products';
const EDIT_KEY = 'editingProductId';

function getProducts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function setMessage(elementId, text, type = 'success') {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.textContent = text;
   el.className = `message ${type === "success" ? "success" : "error-box"}`;
  el.classList.remove('hidden');
}

function clearMessage(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = '';
  el.className = 'message hidden';
}

function setError(fieldId, message) {
  const errorEl = document.getElementById(`${fieldId}Error`);
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearErrors() {
  [
    'name',
    'price',
    'description',
    'category',
    'stock',
    'password',
    'confirmPassword'
  ].forEach((field) => setError(field, ''));
}

function validateProductForm(data) {
  clearErrors();
  let isValid = true;

  if (!data.name.trim()) {
    setError('name', 'Tên sản phẩm không được để trống.');
    isValid = false;
  }

  if (data.price === '' || isNaN(data.price) || Number(data.price) <= 0) {
    setError('price', 'Giá sản phẩm phải là số và lớn hơn 0.');
    isValid = false;
  }

  if (data.stock === '' || !Number.isInteger(Number(data.stock)) || Number(data.stock) < 0) {
    setError('stock', 'Số lượng tồn kho phải là số nguyên không âm.');
    isValid = false;
  }

  if (!data.password) {
    setError('password', 'Mật khẩu quản trị không được để trống.');
    isValid = false;
  } else if (data.password.length < 6) {
    setError('password', 'Mật khẩu phải có ít nhất 6 ký tự.');
    isValid = false;
  }

  if (!data.confirmPassword) {
    setError('confirmPassword', 'Xác nhận mật khẩu không được để trống.');
    isValid = false;
  } else if (data.confirmPassword !== data.password) {
    setError('confirmPassword', 'Xác nhận mật khẩu phải khớp với mật khẩu quản trị.');
    isValid = false;
  }

  return isValid;
}

function loadEditProductToForm() {
  const form = document.getElementById('productForm');
  if (!form) return;

  const editingId = localStorage.getItem(EDIT_KEY);
  if (!editingId) return;

  const products = getProducts();
  const product = products.find((item) => item.id === editingId);
  if (!product) return;

  document.getElementById('formTitle').textContent = 'Chỉnh sửa sản phẩm';
  document.getElementById('productId').value = product.id;
  document.getElementById('name').value = product.name;
  document.getElementById('description').value = product.description;
  document.getElementById('price').value = product.price;
  document.getElementById('category').value = product.category;
  document.getElementById('stock').value = product.stock;
  document.getElementById('password').value = product.password;
  document.getElementById('confirmPassword').value = product.password;
}

function handleProductForm() {
  const form = document.getElementById('productForm');
  if (!form) return;

  loadEditProductToForm();

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearMessage('formMessage');

    const productId = document.getElementById('productId').value;

    const productData = {
      id: productId || Date.now().toString(),
      name: document.getElementById('name').value.trim(),
      description: document.getElementById('description').value.trim(),
      price: document.getElementById('price').value.trim(),
      category: document.getElementById('category').value,
      stock: document.getElementById('stock').value.trim(),
      password: document.getElementById('password').value,
      confirmPassword: document.getElementById('confirmPassword').value
    };

    const isValid = validateProductForm(productData);
    if (!isValid) {
      setMessage('formMessage', 'Vui lòng sửa các lỗi trong form.', 'error');
      return;
    }

    const products = getProducts();
    const finalProduct = {
      id: productData.id,
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      category: productData.category,
      stock: Number(productData.stock),
      password: productData.password
    };

    const existingIndex = products.findIndex((item) => item.id === finalProduct.id);

    if (existingIndex >= 0) {
      products[existingIndex] = finalProduct;
    } else {
      products.push(finalProduct);
    }

    saveProducts(products);
    localStorage.removeItem(EDIT_KEY);
    window.location.href = 'products.html';
  });

  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      localStorage.removeItem(EDIT_KEY);
      clearErrors();
      clearMessage('formMessage');
      document.getElementById('productId').value = '';
      document.getElementById('formTitle').textContent = 'Thêm / Sửa sản phẩm';
    });
  }
}

function renderProducts(keyword = '') {
  const tbody = document.getElementById('productTableBody');
  if (!tbody) return;

  const products = getProducts();
  const normalizedKeyword = keyword.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const byName = product.name.toLowerCase().includes(normalizedKeyword);
    const byCategory = product.category.toLowerCase().includes(normalizedKeyword);
    return byName || byCategory;
  });

  if (filteredProducts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">Chưa có sản phẩm nào phù hợp.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredProducts
    .map((product) => {
      const total = product.price * product.stock;
      return `
        <tr>
          <td>
            <div class="product-name">${product.name}</div>
            <div class="product-desc">${product.description || 'Không có mô tả'}</div>
          </td>
          <td>${product.category || '-'}</td>
          <td>${product.price.toLocaleString('vi-VN')} đ</td>
          <td>${product.stock}</td>
          <td>${total.toLocaleString('vi-VN')} đ</td>
          <td>
            <div class="action-group">
              <button class="btn btn-warning" onclick="editProduct('${product.id}')">Sửa</button>
              <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Xóa</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

function editProduct(id) {
  localStorage.setItem(EDIT_KEY, id);
  window.location.href = 'add-product.html';
}

function deleteProduct(id) {
  const confirmed = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?');
  if (!confirmed) return;

  const products = getProducts().filter((product) => product.id !== id);
  saveProducts(products);
  renderProducts(document.getElementById('keyword')?.value || '');
  setMessage('listMessage', 'Xóa sản phẩm thành công.', 'success');
}

function handleProductList() {
  const tbody = document.getElementById('productTableBody');
  if (!tbody) return;

  renderProducts();

  const keywordInput = document.getElementById('keyword');
  if (keywordInput) {
    keywordInput.addEventListener('input', function () {
      renderProducts(this.value);
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  handleProductForm();
  handleProductList();
});