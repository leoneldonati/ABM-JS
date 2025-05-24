import { END_POINTS, getData } from "./api.js";
import Store from "./store/index.js";

const initialState = { data: [], selectedEndpoint: "/todos", quantity: 10 };
export const store = new Store(initialState, {
  persist: false,
  name: "stored-state",
});

const $avalibleEndpoints = document.querySelector("#avalible-endpoints");
const $itemsGrid = document.querySelector("#items-grid");
const $itemsCounter = document.querySelector("#items-counter");
const $error = document.querySelector("#error");
const $loading = document.querySelector("#loading");

const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting && $loading.style.display !== "block") {
      const { quantity } = store.get();
      store.update({ quantity: quantity + 10 });
      getData(store, showLoading, showError);
    }
  },
  { rootMargin: "100px" }
);
// Función para mostrar errores
export const showError = (message) => {
  $error.textContent = message;
  $error.style.display = "block";
  $loading.style.display = "none";
};

// Función para mostrar el indicador de carga
export const showLoading = () => {
  $error.style.display = "none";
  $loading.style.display = "block";
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

const initializeButtons = () => {
  END_POINTS.forEach((path) => {
    const button = document.createElement("button");
    button.textContent = path;

    button.addEventListener("click", () => {
      store.update({ selectedEndpoint: path, quantity: 10, data: [] }); // Resetear data y quantity
      $itemsGrid.innerHTML = ""; // Limpiar el grid
      getData(store, showLoading, showError);
    });

    $avalibleEndpoints.appendChild(button);
  });
};

// Suscribirse a cambios en el store
store.subscribe((state) => {
  $loading.style.display = "none";
  if (Array.isArray(state?.data)) {
    const existingIds = new Set(
      Array.from($itemsGrid.children).map((el) => el.getAttribute("aria-label"))
    );
    state.data.forEach((item) => {
      if (!existingIds.has(`Item ${item.id || "sin ID"}`)) {
        paintCard(item);
      }
    });
    $itemsCounter.innerText = state.data.length;

    // Observar el último elemento
    const lastItem = $itemsGrid.lastElementChild;
    if (lastItem) {
      observer.disconnect(); // Desconectar observadores previos
      observer.observe(lastItem);
    }
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
