import Store from "./store/index.js";

const store = new Store(
  { data: [], selectedEndpoint: "/todos", quantity: 10 },
  { persist: false, name: "stored-state" }
);

const $avalibleEndpoints = document.querySelector("#avalible-endpoints");
const $itemsGrid = document.querySelector("#items-grid");
const $itemsCounter = document.querySelector("#items-counter");
const $itemsHandler = document.querySelector("#more-items-button");
const $error = document.querySelector("#error");
const $loading = document.querySelector("#loading");
const END_POINTS = [
  "/todos",
  "/posts",
  "/photos",
  "/users",
  "/albums",
  "/comments",
];

let scrollY = 0;
$itemsHandler.addEventListener("click", () => {
  scrollY = window.scrollY;
  const { quantity } = store.get();

  store.update({ quantity: quantity + 10 });

  getData();
});

// Función para mostrar errores
const showError = (message) => {
  $error.textContent = message;
  $error.style.display = "block";
  $loading.style.display = "none";
};

// Función para mostrar el indicador de carga
const showLoading = () => {
  $error.style.display = "none";
  $loading.style.display = "block";
  $itemsGrid.innerHTML = ""; // Limpiar el grid mientras se carga
};

// Función para pintar una tarjeta completa
const paintCard = (item) => {
  const article = document.createElement("article");
  article.setAttribute("role", "region");
  article.setAttribute("aria-label", `Item ${item.id || "sin ID"}`);

  // Crear contenido según el endpoint
  let content = "";
  if (item.title) {
    // Para /todos, /posts, /albums
    content += `<h3>${item.title}</h3>`;
    if (item.id) content += `<p><strong>ID:</strong> ${item.id}</p>`;
    if (item.userId)
      content += `<p><strong>User ID:</strong> ${item.userId}</p>`;
    if (item.body) content += `<p><strong>Body:</strong> ${item.body}</p>`;
    if (item.completed !== undefined) {
      content += `<p class="status ${
        item.completed ? "completed" : "pending"
      }"><strong>Status:</strong> ${
        item.completed ? "Completed" : "Pending"
      }</p>`;
    }
  } else if (item.name) {
    // Para /users, /comments
    content += `<h3>${item.name}</h3>`;
    if (item.id) content += `<p><strong>ID:</strong> ${item.id}</p>`;
    if (item.email) content += `<p><strong>Email:</strong> ${item.email}</p>`;
    if (item.body) content += `<p><strong>Comment:</strong> ${item.body}</p>`;
  } else if (item.thumbnailUrl) {
    // Para /photos
    content += `<h3>${item.title || "Photo"}</h3>`;
    if (item.id) content += `<p><strong>ID:</strong> ${item.id}</p>`;
    content += `<img src="${item.thumbnailUrl}" alt="Thumbnail for photo ${item.id}" />`;
  } else {
    // Fallback para datos desconocidos
    content += `<h3>Item ${item.id || "sin ID"}</h3>`;
    content += `<p>${JSON.stringify(item)}</p>`;
  }

  article.innerHTML = content;
  $itemsGrid.appendChild(article);
};

// Función para actualizar los estilos de los botones
const updateButtonStyles = () => {
  const selectedEndpoint = store.get().selectedEndpoint;
  const buttons = $avalibleEndpoints.querySelectorAll("button");

  buttons.forEach((btn) => {
    const buttonEndpoint = btn.textContent;
    btn.classList.toggle("isActive", buttonEndpoint === selectedEndpoint);
  });
};

// Función para obtener datos de la API
const getData = async () => {
  const { quantity, selectedEndpoint } = store.get();
  const API_URL = "https://jsonplaceholder.typicode.com";

  showLoading();

  try {
    const res = await fetch(`${API_URL}${selectedEndpoint}`);
    if (!res.ok) throw new Error(`Error en la solicitud: ${res.status}`);
    const data = await res.json();
    store.update({ data: data.slice(0, quantity) }); // Uso update para mantener selectedEndpoint
  } catch (e) {
    showError(`Error al obtener datos: ${e.message}`);
  }
};

// Inicializar botones
const initializeButtons = () => {
  END_POINTS.forEach((path) => {
    const button = document.createElement("button");
    button.textContent = path;

    button.addEventListener("click", () => {
      store.update({ selectedEndpoint: path });
      getData();
    });

    $avalibleEndpoints.appendChild(button);
  });
};

// Suscribirse a cambios en el store
store.subscribe((state) => {
  $itemsGrid.innerHTML = "";
  $loading.style.display = "none";
  if (Array.isArray(state?.data)) {
    state.data.forEach(paintCard);
    $itemsCounter.innerText = state.data.length;

    window.scrollTo({ top: scrollY });
  }
  updateButtonStyles();
});

// Inicializar la UI
const initializeUI = () => {
  initializeButtons();
  updateButtonStyles();
  getData();
};

initializeUI();
