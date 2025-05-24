import { showError, showLoading, store } from "./app.js";

export const END_POINTS = [
  "/todos",
  "/posts",
  "/photos",
  "/users",
  "/albums",
  "/comments",
];
// Función para obtener datos de la API
export const getData = async (retries = 3) => {
  const { quantity, selectedEndpoint } = store.get();
  const API_URL = "https://jsonplaceholder.typicode.com";

  showLoading();

  try {
    const res = await fetch(`${API_URL}${selectedEndpoint}`);
    if (!res.ok) throw new Error(`Error en la solicitud: ${res.status}`);
    const data = await res.json();
    store.update({ data: data.slice(0, quantity) });
  } catch (e) {
    if (retries > 0) {
      let timerId = 0;
      console.log(`Reintentando... (${retries} intentos restantes)`);
      clearTimeout(timerId);
      timerId = setTimeout(() => getData(retries - 1), 1000); // Reintenta después de 1 segundo
    } else {
      showError(
        e.message.includes("404")
          ? "Endpoint no encontrado"
          : "No se pudo conectar a la API"
      );
    }
  }
};
