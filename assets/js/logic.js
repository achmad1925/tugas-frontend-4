/* =========================
   MENU MOBILE
========================= */

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("active");
    });
}


/* =========================
   1. DATASET PRODUK UMKM
========================= */

const STORAGE_KEY = "umkmProducts";
const STORAGE_MODE_KEY = "umkmProductsMode";

const defaultProducts = [
    {
        id: 1,
        name: "Keripik Pisang",
        category: "Makanan",
        price: 15000,
        stock: 20
    },
    {
        id: 2,
        name: "Kopi Lokal",
        category: "Minuman",
        price: 25000,
        stock: 15
    },
    {
        id: 3,
        name: "Kue Tradisional",
        category: "Makanan",
        price: 20000,
        stock: 10
    },
    {
        id: 4,
        name: "Tas Anyaman",
        category: "Kerajinan",
        price: 75000,
        stock: 8
    },
    {
        id: 5,
        name: "Sambal Rumahan",
        category: "Makanan",
        price: 18000,
        stock: 25
    },
    {
        id: 6,
        name: "Jus Buah Segar",
        category: "Minuman",
        price: 12000,
        stock: 12
    },
    {
        id: 7,
        name: "Brownies Kukus",
        category: "Makanan",
        price: 30000,
        stock: 10
    },
    {
        id: 8,
        name: "Kerajinan Bambu",
        category: "Kerajinan",
        price: 50000,
        stock: 6
    }
];


/* =========================================
   PRODUK SIMPANAN (localStorage)
   Produk baru tersimpan agar muncul
   kembali saat halaman dibuka ulang.
========================================= */

function readSavedProducts() {

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return [];
        }

        const data = JSON.parse(raw);

        if (!Array.isArray(data)) {
            return [];
        }

        return data.filter(function (item) {
            return item &&
                typeof item.id === "number" &&
                typeof item.name === "string" &&
                typeof item.category === "string" &&
                typeof item.price === "number" &&
                typeof item.stock === "number";
        });

    } catch (error) {
        return [];
    }
}


function writeSavedProducts(list) {

    try {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(list)
        );
    } catch (error) {
        /* localStorage tidak tersedia:
           data tetap hidup di sesi ini. */
    }
}


/*
   DAFTAR PRODUK AKTIF
   - mode "full"  : localStorage menyimpan seluruh daftar produk
   - selain itu   : data lama (hanya produk tambahan), digabung
                    dengan data awal lalu disimpan ulang sebagai
                    satu daftar penuh.
*/
const products = defaultProducts.slice();
const storedProducts = readSavedProducts();


function readStorageMode() {
    try {
        return window.localStorage.getItem(STORAGE_MODE_KEY);
    } catch (error) {
        return null;
    }
}


function writeStorageMode(mode) {
    try {
        window.localStorage.setItem(STORAGE_MODE_KEY, mode);
    } catch (error) {
        /* localStorage tidak tersedia */
    }
}


function saveProducts() {
    writeSavedProducts(products);
    writeStorageMode("full");
}


if (readStorageMode() === "full") {
    products.length = 0;
}

storedProducts.forEach(function (product) {
    products.push(product);
});

saveProducts();


/* =========================
   HELPER
========================= */

function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(value);
}


function getNextProductId() {
    return products.reduce(function (maxId, product) {
        return Math.max(maxId, product.id);
    }, 0) + 1;
}


function setFieldState(field, isValid) {

    if (!field || !field.closest) {
        return;
    }

    const formGroup = field.closest(".form-group");

    if (formGroup) {
        formGroup.classList.toggle("is-invalid", !isValid);
    }
}


/* =========================
   2A. FILTER PRODUK
========================= */

function filterProducts(category, minPrice, maxPrice) {
    return products.filter(function (product) {
        const matchCategory =
            !category ||
            product.category.toLowerCase() ===
            category.toLowerCase();

        const matchMinPrice =
            minPrice === undefined ||
            product.price >= minPrice;

        const matchMaxPrice =
            maxPrice === undefined ||
            product.price <= maxPrice;

        return matchCategory &&
               matchMinPrice &&
               matchMaxPrice;
    });
}


/* =========================
   2B. TOTAL VALUASI STOK
========================= */

function calculateStockValue() {
    return products.reduce(function (total, product) {
        return total + (product.price * product.stock);
    }, 0);
}


/* =========================
   3. OUTPUT CONSOLE
========================= */

console.log(`
========================================
       DATA PRODUK UMKM NUSANTARA
========================================
Jumlah produk: ${products.length}
`);

products.forEach(function (product) {
    console.log(`
ID       : ${product.id}
Nama     : ${product.name}
Kategori : ${product.category}
Harga    : ${formatRupiah(product.price)}
Stok     : ${product.stock} unit
-----------------------------------------
    `);
});


const hasilKategori = filterProducts("Makanan");

console.log(`
========================================
       FILTER KATEGORI MAKANAN
========================================
Jumlah hasil: ${hasilKategori.length}
`);

hasilKategori.forEach(function (product) {
    console.log(
        `${product.name} | ${formatRupiah(product.price)} | Stok: ${product.stock}`
    );
});


const hasilHarga = filterProducts(undefined, 15000, 30000);

console.log(`
========================================
       FILTER RENTANG HARGA
========================================
Rentang: Rp15.000 - Rp30.000
Jumlah hasil: ${hasilHarga.length}
`);

hasilHarga.forEach(function (product) {
    console.log(
        `${product.name} | ${formatRupiah(product.price)} | Stok: ${product.stock}`
    );
});


const totalValuasi = calculateStockValue();

console.log(`
========================================
       TOTAL VALUASI STOK UMKM
========================================
Total valuasi stok: ${formatRupiah(totalValuasi)}
========================================
`);


/* =========================
   KATALOG: SEARCH & FILTER
========================= */

function getCardName(card) {

    const fromAttribute = card.getAttribute("data-name");

    if (fromAttribute) {
        return fromAttribute;
    }

    const title = card.querySelector("h3");

    return title ? title.textContent : "";
}


function showNoProduct(found) {

    const noProduct = document.getElementById("noProduct");

    if (noProduct) {
        noProduct.style.display = found ? "none" : "block";
    }
}


function applyCatalogFilters() {

    const searchInput = document.getElementById("searchProduct");
    const categorySelect = document.getElementById("categoryFilter");

    if (!searchInput || !categorySelect) {
        return;
    }

    const keyword = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;

    let found = false;

    const cards = document.querySelectorAll(".catalog-card");

    cards.forEach(function (card) {

        const name = getCardName(card).toLowerCase();
        const cardCategory =
            (card.getAttribute("data-category") || "").toLowerCase();

        const matchKeyword = name.indexOf(keyword) !== -1;
        const matchCategory =
            category === "all" || cardCategory === category;

        const visible = matchKeyword && matchCategory;

        card.style.display = visible ? "block" : "none";

        if (visible) {
            found = true;
        }

    });

    showNoProduct(found);
}


function searchProduct() {
    applyCatalogFilters();
}


function filterCategory() {
    applyCatalogFilters();
}


const searchInput = document.getElementById("searchProduct");

if (searchInput) {
    searchInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            searchProduct();
        }
    });
}


/* =========================
   KATALOG: KARTU PRODUK
========================= */

const CATEGORY_EMOJI = {
    makanan: "🍴",
    minuman: "🥤",
    kerajinan: "🧺"
};


function createCatalogCard(product) {

    const card = document.createElement("div");
    card.className = "catalog-card";
    card.setAttribute(
        "data-category",
        product.category.toLowerCase()
    );
    card.setAttribute("data-name", product.name);

    const image = document.createElement("div");
    image.className = "catalog-image";

    const emoji = document.createElement("span");
    emoji.textContent =
        CATEGORY_EMOJI[product.category.toLowerCase()] || "🛍️";

    image.appendChild(emoji);

    const info = document.createElement("div");
    info.className = "catalog-info";

    const badge = document.createElement("span");
    badge.className = "product-category";
    badge.textContent = product.category;

    const title = document.createElement("h3");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.textContent =
        product.description ||
        `Produk ${product.category} dari UMKM Nusantara.`;

    const bottom = document.createElement("div");
    bottom.className = "catalog-bottom";

    const price = document.createElement("strong");
    price.textContent = formatRupiah(product.price);

    bottom.appendChild(price);

    info.appendChild(badge);
    info.appendChild(title);
    info.appendChild(description);
    info.appendChild(bottom);

    card.appendChild(image);
    card.appendChild(info);

    return card;
}


function renderCatalogProducts() {

    const grid = document.querySelector(".catalog-grid");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    products.forEach(function (product) {
        grid.appendChild(createCatalogCard(product));
    });

    applyCatalogFilters();
}


/* =========================
   FORM PRODUK
   (formula.html)
========================= */

let productFormFields = null;


function initProductForm() {

    const form = document.getElementById("productForm");

    if (!form) {
        return;
    }

    const fields = {
        form: form,
        name: document.getElementById("productName"),
        category: document.getElementById("category"),
        price: document.getElementById("price"),
        stock: document.getElementById("stock"),
        description: document.getElementById("description"),
        feedback: document.getElementById("formFeedback"),
        previewName: document.getElementById("previewName"),
        previewCategory: document.getElementById("previewCategory"),
        previewDescription: document.getElementById("previewDescription"),
        previewPrice: document.getElementById("previewPrice"),
        previewStock: document.getElementById("previewStock"),
        previewTotal: document.getElementById("previewTotal"),
        previewInfo: document.getElementById("previewInfo"),
        previewStatus: document.getElementById("previewStatus")
    };

    if (!fields.name || !fields.category ||
        !fields.price || !fields.stock) {
        return;
    }

    productFormFields = fields;

    form.addEventListener("input", function () {
        hideProductFeedback();
        updateProductPreview();
    });

    form.addEventListener("change", function () {
        hideProductFeedback();
        updateProductPreview();
    });

    form.addEventListener("submit", handleProductSubmit);

    const cancelButton = document.getElementById("cancelEditBtn");

    if (cancelButton) {
        cancelButton.addEventListener("click", cancelEditProduct);
    }

    updateProductPreview();
}


function getFormValues() {

    const fields = productFormFields;

    return {
        name: fields.name.value.trim(),
        category: fields.category.value,
        price: Number(fields.price.value),
        stock: Number(fields.stock.value),
        priceSet: fields.price.value.trim() !== "",
        stockSet: fields.stock.value.trim() !== "",
        description: fields.description
            ? fields.description.value.trim()
            : ""
    };
}


function validateProductForm() {

    const values = getFormValues();
    const errors = [];

    const nameValid = values.name !== "";
    setFieldState(productFormFields.name, nameValid);

    if (!nameValid) {
        errors.push("nama produk");
    }


    const categoryValid = values.category !== "";
    setFieldState(productFormFields.category, categoryValid);

    if (!categoryValid) {
        errors.push("kategori");
    }


    const priceValid =
        values.priceSet &&
        Number.isSafeInteger(values.price) &&
        values.price > 0;

    setFieldState(productFormFields.price, priceValid);

    if (!priceValid) {
        errors.push("harga");
    }


    const stockValid =
        values.stockSet &&
        Number.isSafeInteger(values.stock) &&
        values.stock >= 0;

    setFieldState(productFormFields.stock, stockValid);

    if (!stockValid) {
        errors.push("stok");
    }

    return {
        valid: errors.length === 0,
        errors: errors,
        values: values
    };
}


function setPreview(element, text) {
    if (element) {
        element.textContent = text;
    }
}


function updateProductPreview() {

    if (!productFormFields) {
        return;
    }

    const values = getFormValues();

    const isComplete =
        values.name !== "" &&
        values.category !== "" &&
        values.priceSet &&
        values.price > 0 &&
        values.stockSet;

    setPreview(
        productFormFields.previewName,
        values.name || "Belum diisi"
    );

    setPreview(
        productFormFields.previewCategory,
        values.category || "Belum dipilih"
    );

    setPreview(
        productFormFields.previewDescription,
        values.description || "-"
    );

    setPreview(
        productFormFields.previewPrice,
        values.priceSet && values.price >= 0
            ? formatRupiah(values.price)
            : "Rp0"
    );

    setPreview(
        productFormFields.previewStock,
        values.stockSet
            ? `${values.stock} unit`
            : "0 unit"
    );

    setPreview(
        productFormFields.previewTotal,
        formatRupiah(values.price * values.stock)
    );

    if (productFormFields.previewInfo) {
        productFormFields.previewInfo.className =
            "summary-info " + (isComplete ? "complete" : "incomplete");
    }

    setPreview(
        productFormFields.previewStatus,
        isComplete
            ? "Data lengkap dan siap disimpan."
            : "Lengkapi data wajib: nama, kategori, harga, dan stok."
    );
}


function showProductFeedback(type, message) {

    const feedback = productFormFields && productFormFields.feedback;

    if (!feedback) {
        return;
    }

    feedback.className = `form-feedback show ${type}`;

    feedback.textContent = message;
}


function hideProductFeedback() {

    const feedback = productFormFields && productFormFields.feedback;

    if (!feedback) {
        return;
    }

    feedback.className = "form-feedback";

    feedback.textContent = "";
}


/* =========================
   AKSI PRODUK: EDIT & HAPUS
   + TABEL DAFTAR PRODUK
========================= */

let editingProductId = null;


function findProductById(id) {

    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            return products[i];
        }
    }

    return null;
}


function renderProductTable() {

    const tbody = document.getElementById("productTableBody");

    if (!tbody) {
        return;
    }

    tbody.innerHTML = "";

    products.forEach(function (product) {
        tbody.appendChild(createProductRow(product));
    });

    filterProductTable();
}


/* =========================
   PENCARIAN PADA TABEL
========================= */

function filterProductTable() {

    const tbody = document.getElementById("productTableBody");
    const emptyMessage = document.getElementById("tableEmpty");
    const countLabel = document.getElementById("tableCount");
    const searchBox = document.getElementById("tableSearch");

    if (!tbody) {
        return;
    }

    const keyword = searchBox
        ? searchBox.value.trim().toLowerCase()
        : "";

    const rows = tbody.querySelectorAll("tr");

    let visibleCount = 0;

    rows.forEach(function (row) {

        const haystack = row.getAttribute("data-search") || "";

        const visible =
            keyword === "" ||
            haystack.indexOf(keyword) !== -1;

        row.style.display = visible ? "" : "none";

        if (visible) {
            visibleCount++;
        }
    });

    if (countLabel) {
        countLabel.textContent =
            `Menampilkan ${visibleCount} dari ${products.length} produk`;
    }

    if (emptyMessage) {

        emptyMessage.hidden = visibleCount > 0;

        emptyMessage.textContent = products.length === 0
            ? "Belum ada produk. Tambahkan data melalui formulir di atas."
            : "Produk tidak ditemukan. Coba gunakan kata kunci lain.";
    }
}


const tableSearchInput = document.getElementById("tableSearch");

if (tableSearchInput) {
    tableSearchInput.addEventListener("input", filterProductTable);
}


function createProductRow(product) {

    const row = document.createElement("tr");
    row.setAttribute("data-id", String(product.id));

    row.setAttribute(
        "data-search",
        (
            product.id + " " +
            product.name + " " +
            product.category + " " +
            product.price
        ).toLowerCase()
    );

    const idCell = document.createElement("td");
    idCell.textContent = product.id;

    const nameCell = document.createElement("td");
    nameCell.textContent = product.name;

    const categoryCell = document.createElement("td");
    categoryCell.textContent = product.category;

    const priceCell = document.createElement("td");
    priceCell.className = "price-cell";
    priceCell.textContent = formatRupiah(product.price);

    const stockCell = document.createElement("td");
    stockCell.textContent = `${product.stock} unit`;

    const actionCell = document.createElement("td");

    const actions = document.createElement("div");
    actions.className = "table-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "table-btn table-btn-edit";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function () {
        startEditProduct(product.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "table-btn table-btn-delete";
    deleteButton.textContent = "Hapus";
    deleteButton.addEventListener("click", function () {
        deleteProduct(product.id);
    });

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    actionCell.appendChild(actions);

    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(categoryCell);
    row.appendChild(priceCell);
    row.appendChild(stockCell);
    row.appendChild(actionCell);

    return row;
}


function setProductFormMode(mode) {

    const isEdit = mode === "edit";

    const title = document.getElementById("formTitle");
    const submitButton = document.getElementById("submitProductBtn");
    const cancelButton = document.getElementById("cancelEditBtn");

    if (title) {
        title.textContent = isEdit
            ? "Edit Data Produk"
            : "Tambah Data Produk";
    }

    if (submitButton) {
        submitButton.textContent = isEdit
            ? "Simpan Perubahan"
            : "Tambah Produk";
    }

    if (cancelButton) {
        cancelButton.hidden = !isEdit;
    }
}


function resetProductForm() {

    if (!productFormFields) {
        return;
    }

    productFormFields.form.reset();

    productFormFields.form
        .querySelectorAll(".is-invalid")
        .forEach(function (group) {
            group.classList.remove("is-invalid");
        });

    hideProductFeedback();
    updateProductPreview();
}


function startEditProduct(id) {

    const product = findProductById(id);

    if (!product || !productFormFields) {
        return;
    }

    editingProductId = id;

    productFormFields.name.value = product.name;
    productFormFields.category.value = product.category;
    productFormFields.price.value = String(product.price);
    productFormFields.stock.value = String(product.stock);

    if (productFormFields.description) {
        productFormFields.description.value = product.description || "";
    }

    setProductFormMode("edit");
    hideProductFeedback();
    updateProductPreview();

    productFormFields.form.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


function cancelEditProduct() {

    editingProductId = null;
    setProductFormMode("add");
    resetProductForm();
}


function deleteProduct(id) {

    const product = findProductById(id);

    if (!product) {
        return;
    }

    const confirmed = window.confirm(
        `Hapus produk "${product.name}" dari daftar?`
    );

    if (!confirmed) {
        return;
    }

    const index = products.indexOf(product);

    products.splice(index, 1);
    saveProducts();

    if (editingProductId === id) {
        cancelEditProduct();
    }

    renderProductTable();
    renderCatalogProducts();

    showProductFeedback(
        "success",
        `Produk "${product.name}" telah dihapus dari daftar.`
    );

    console.log(`
=== PRODUK DIHAPUS ===
ID   : ${product.id}
Nama : ${product.name}
`);
}


function handleProductSubmit(event) {

    event.preventDefault();

    if (!productFormFields) {
        return;
    }

    const result = validateProductForm();

    if (!result.valid) {

        showProductFeedback(
            "error",
            "Data gagal disimpan. " +
            "Lengkapi bagian berikut: " +
            result.errors.join(", ") + "."
        );

        updateProductPreview();

        return;
    }

    const values = result.values;

    /* =========================
       MODE EDIT
    ========================= */

    if (editingProductId !== null) {

        const existingProduct = findProductById(editingProductId);

        if (!existingProduct) {
            cancelEditProduct();
            return;
        }

        existingProduct.name = values.name;
        existingProduct.category = values.category;
        existingProduct.price = values.price;
        existingProduct.stock = values.stock;
        existingProduct.description = values.description;

        saveProducts();

        const editedName = existingProduct.name;
        const editedId = existingProduct.id;

        editingProductId = null;
        setProductFormMode("add");
        resetProductForm();

        renderProductTable();
        renderCatalogProducts();

        showProductFeedback(
            "success",
            `Berhasil! Produk "${editedName}" (ID ${editedId}) berhasil diperbarui.`
        );

        console.log(`
=== PRODUK UMKM DIPERBARUI ===
ID       : ${editedId}
Nama     : ${editedName}
Kategori : ${existingProduct.category}
Harga    : ${formatRupiah(existingProduct.price)}
Stok     : ${existingProduct.stock} unit
`);

        return;
    }

    /* =========================
       MODE TAMBAH
    ========================= */

    const newProduct = {
        id: getNextProductId(),
        name: values.name,
        category: values.category,
        price: values.price,
        stock: values.stock,
        description: values.description
    };

    products.push(newProduct);
    saveProducts();

    resetProductForm();

    renderProductTable();
    renderCatalogProducts();

    showProductFeedback(
        "success",
        `Berhasil! Produk "${newProduct.name}" ditambahkan dengan ID ${newProduct.id}.`
    );

    console.log(`
=== PRODUK UMKM BERHASIL DITAMBAHKAN ===
ID       : ${newProduct.id}
Nama     : ${newProduct.name}
Kategori : ${newProduct.category}
Harga    : ${formatRupiah(newProduct.price)}
Stok     : ${newProduct.stock} unit
Nilai stok: ${formatRupiah(newProduct.price * newProduct.stock)}
`);
}


/* =========================
   LOGIN
========================= */

const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.textContent = "🙈";
        } else {
            passwordInput.type = "password";
            togglePassword.textContent = "👁";
        }
    });
}


const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const passwordValue = passwordInput
            ? passwordInput.value
            : "";

        if (email === "" || passwordValue === "") {
            alert("Email dan password harus diisi.");
            return;
        }

        /*
         * LOGIN SEMENTARA
         *
         * Pada tahap ini login belum
         * menggunakan database.
         */

        alert("Login berhasil!\n\nEmail: " + email);

        /*
         * Setelah backend dibuat,
         * bagian ini dapat diganti
         * dengan proses autentikasi.
         */
    });
}


/* =========================
   INIT
========================= */

renderCatalogProducts();
renderProductTable();
initProductForm();
