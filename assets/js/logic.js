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

const products = [
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


let savedProducts = readSavedProducts();

savedProducts.forEach(function (product) {
    products.push(product);
});


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

    const orderLink = document.createElement("a");
    orderLink.href = "pemesanan.html";
    orderLink.className = "btn-small";
    orderLink.textContent = "Pesan";

    bottom.appendChild(price);
    bottom.appendChild(orderLink);

    info.appendChild(badge);
    info.appendChild(title);
    info.appendChild(description);
    info.appendChild(bottom);

    card.appendChild(image);
    card.appendChild(info);

    return card;
}


function renderSavedProducts() {

    const grid = document.querySelector(".catalog-grid");

    if (!grid) {
        return;
    }

    savedProducts.forEach(function (product) {
        grid.appendChild(createCatalogCard(product));
    });
}


function displayAddedProduct(product) {

    const list = document.getElementById("addedProducts");

    if (!list) {
        return;
    }

    const firstItem = list.firstElementChild;

    if (firstItem && firstItem.tagName === "P") {
        list.innerHTML = "";
    }

    const item = document.createElement("article");
    item.className = "added-product-item";

    const title = document.createElement("h3");
    title.textContent = `${product.id}. ${product.name}`;

    const category = document.createElement("p");
    category.textContent = `Kategori: ${product.category}`;

    const price = document.createElement("p");
    price.textContent = `Harga: ${formatRupiah(product.price)}`;

    const stock = document.createElement("p");
    stock.textContent = `Stok: ${product.stock} unit`;

    item.appendChild(title);
    item.appendChild(category);
    item.appendChild(price);
    item.appendChild(stock);

    list.insertBefore(item, list.firstChild);
}


/* =========================
   FORM PRODUK
   (katalog.html & formula.html)
========================= */

let productFormFields = null;


function initProductForm() {

    const form = document.getElementById("productForm");

    if (!form) {
        return;
    }

    const fields = {
        form: form,
        name:
            document.getElementById("productNameInput") ||
            document.getElementById("productName"),
        category:
            document.getElementById("productCategoryInput") ||
            document.getElementById("category"),
        price:
            document.getElementById("productPriceInput") ||
            document.getElementById("price"),
        stock:
            document.getElementById("productStockInput") ||
            document.getElementById("stock"),
        description: document.getElementById("description"),
        feedback:
            document.getElementById("productFeedback") ||
            document.getElementById("formFeedback"),
        previewId: document.getElementById("previewId"),
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
        productFormFields.previewId,
        String(getNextProductId())
    );

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

    feedback.className =
        feedback.id === "formFeedback"
            ? `form-feedback show ${type}`
            : `product-feedback ${type}`;

    feedback.textContent = message;
}


function hideProductFeedback() {

    const feedback = productFormFields && productFormFields.feedback;

    if (!feedback) {
        return;
    }

    feedback.className =
        feedback.id === "formFeedback"
            ? "form-feedback"
            : "product-feedback";

    feedback.textContent = "";
}


function appendProductOption(product) {

    const select = document.getElementById("product");

    if (!select) {
        return;
    }

    const exists = Array.prototype.some.call(
        select.options,
        function (option) {
            return option.value === product.name;
        }
    );

    if (exists) {
        return;
    }

    const option = document.createElement("option");
    option.value = product.name;
    option.setAttribute("data-price", String(product.price));
    option.textContent =
        `${product.name} - ${formatRupiah(product.price)}`;

    select.appendChild(option);
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

    const newProduct = {
        id: getNextProductId(),
        name: values.name,
        category: values.category,
        price: values.price,
        stock: values.stock,
        description: values.description
    };

    products.push(newProduct);

    savedProducts.push(newProduct);
    writeSavedProducts(savedProducts);

    const grid = document.querySelector(".catalog-grid");

    if (grid) {
        grid.appendChild(createCatalogCard(newProduct));
    }

    displayAddedProduct(newProduct);
    appendProductOption(newProduct);

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

    productFormFields.form.reset();

    productFormFields.form
        .querySelectorAll(".is-invalid")
        .forEach(function (group) {
            group.classList.remove("is-invalid");
        });

    updateProductPreview();

    applyCatalogFilters();
}


/* =========================
   ORDER SUMMARY (pemesanan)
========================= */

function updateOrderSummary() {

    const productSelect = document.getElementById("product");
    const quantityInput = document.getElementById("quantity");

    if (!productSelect || !quantityInput) {
        return;
    }

    const selectedOption =
        productSelect.options[productSelect.selectedIndex];

    const productName = selectedOption.value;

    const price =
        Number(selectedOption.getAttribute("data-price")) || 0;

    const quantity = Number(quantityInput.value) || 0;

    const total = price * quantity;

    setPreview(
        document.getElementById("summaryProduct"),
        productName || "-"
    );

    setPreview(
        document.getElementById("summaryPrice"),
        formatRupiah(price)
    );

    setPreview(
        document.getElementById("summaryQuantity"),
        String(quantity)
    );

    setPreview(
        document.getElementById("summaryTotal"),
        formatRupiah(total)
    );
}


function initOrderForm() {

    const productSelect = document.getElementById("product");
    const quantityInput = document.getElementById("quantity");
    const orderForm = document.getElementById("orderForm");

    if (!productSelect) {
        return;
    }

    savedProducts.forEach(appendProductOption);

    productSelect.addEventListener("change", updateOrderSummary);

    if (quantityInput) {
        quantityInput.addEventListener("input", updateOrderSummary);
    }

    updateOrderSummary();

    if (!orderForm) {
        return;
    }

    orderForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const customerName =
            document.getElementById("customerName").value;

        const product = productSelect.value;
        const quantity = quantityInput.value;

        const payment =
            document.getElementById("payment").value;

        if (!product) {
            alert("Silakan pilih produk terlebih dahulu.");
            return;
        }

        alert(
            "Pesanan berhasil dibuat!\n\n" +
            "Nama: " + customerName + "\n" +
            "Produk: " + product + "\n" +
            "Jumlah: " + quantity + "\n" +
            "Pembayaran: " + payment
        );

        orderForm.reset();
        updateOrderSummary();
    });
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

renderSavedProducts();
initProductForm();
initOrderForm();
