# ABM JavaScript A simple JavaScript application for interacting with the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/).

The app allows users to select different API endpoints (`/todos`, `/posts`, `/photos`, `/users`, `/albums`, `/comments`) and displays the retrieved data in a responsive grid of cards.
The state is managed using a custom `Store` class with optional persistence to `localStorage` and a subscription-based system for real-time UI updates.

## Table of Contents

- [Features](#features) - [Technologies](#technologies) - [Installation](#installation) - [Usage](#usage) - [API Endpoints](#api-endpoints) - [Customization](#customization)

## Features

- **Dynamic Endpoint Selection**: Choose from six JSONPlaceholder endpoints using buttons.
- **Responsive Card Grid**: Displays data in visually appealing cards, customized for each endpoint (e.g., images for `/photos`, status for `/todos`).
- **State Management**: Uses a custom `Store` class to manage application state with methods for getting, setting, updating, and clearing state.
- **Optional Persistence**: Configurable option to persist state in `localStorage`.
- **Real-time Updates**: Subscription system notifies the UI of state changes instantly.
- **Error Handling**: Displays user-friendly error messages for API or storage issues.
- **Loading Indicator**: Shows a \"Loading...\" message during API requests.
- **Accessibility**: Includes ARIA attributes for screen reader compatibility.
- **Responsive Design**: CSS grid layout adapts to different screen sizes. ## Technologies
- **HTML5**: Structure of the web application.
- **CSS3**: Styling for buttons, cards, and layout.
- **JavaScript (ES Modules)**: Application logic with modern JavaScript.
- **JSONPlaceholder API**: Mock API for fetching data.
- **localStorage**: Optional state persistence.
- **JSDoc**: Documentation for the `Store` class.

## Installation 1.

**Clone the Repository**:

```bash
git clone <repository-url> cd abm-javascript
```

2. **Set Up a Local Server**: Since the project uses ES Modules, you need a local server to avoid CORS issues.
   You can use one of the following:

- **Live Server** (VS Code extension): Install the Live Server extension and run it from the project directory.

3. **Access the Application**: Open your browser and navigate to `http://localhost:8080` (or the port provided by your server).

## Usage 1.

**Select an Endpoint**:

- The application displays buttons for six JSONPlaceholder endpoints: `/todos`, `/posts`, `/photos`, `/users`, `/albums`, `/comments`.
- Click a button to fetch and display data for that endpoint. - The active endpoint button is highlighted with a blue background.

2. **View Data**: - Data is displayed in a grid of cards, each showing relevant fields (e.g., `title`, `id`, `email`, or images for `/photos`). - Cards are styled with shadows, hover effects, and responsive layouts.
3. **Persistence**: - By default, state persistence is disabled. To enable it, modify `app.js` to set `persist: true` in the `Store` constructor.

- Persistent state is stored in `localStorage` under the key `stored-state`.

4. **Error Handling**: - If an API request fails or `localStorage` is unavailable, an error message appears in the UI.

- A \"Loading...\" indicator is shown during API requests.

5. **Accessibility**: - The card grid has `aria-live=\"polite\"` to announce updates to screen readers. - Each card includes `role=\"region\"` and `aria-label` attributes.

# CSS styles for layout, buttons, and cards.

# Store

class for state management

- **`index.html`**: Defines the structure of the app, including headers, endpoint buttons, a card grid, and loading/error messages.
- **`app.js`**: Handles API requests, creates endpoint buttons, and updates the UI based on state changes.
- **`styles/index.css`**: Styles the UI with a responsive grid, button highlighting, and card formatting.
- **`store/index.js`**: Contains the `Store` class, documented with JSDoc, for managing state with persistence and subscriptions.

## API Endpoints

The application uses the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/) to fetch data. The supported endpoints and their displayed fields are:

- **`/todos`**: `id`, `title`, `userId`, `completed` (with \"Completed\" or \"Pending\" status).
- **`/posts`**: `id`, `title`, `userId`, `body`.
- **`/photos`**: `id`, `title`, `thumbnailUrl` (displayed as an image).
- **`/users`**: `id`, `name`, `email`.
- **`/albums`**: `id`, `title`, `userId`.
- **`/comments`**: `id`, `name`, `email`, `body`.

## Customization To extend or customize the application, consider the following:

1. **Enable Persistence**: - In `app.js`, change the `Store` constructor to:

```javascript
const store = new Store(
  { data: [], selectedEndpoint: "/todos" },
  { persist: true, name: "stored-state" }
);
```

- This saves the state to `localStorage` and restores it on page reload.

2. **Add More Fields to Cards**: - Modify the `paintCard` function in `app.js` to include additional fields (e.g., `url` for `/photos`, `address` for `/users`).

- Example:

```javascript
if (item.address) {
  content += `<p><strong>Address:</strong> ${item.address.street}, ${item.address.city}</p>`;
}
```

3. **Add Pagination**:

- Limit the number of cards displayed and add \"Previous\" and \"Next\" buttons to navigate through results.
- Modify `paintCard` to slice the `state.data` array based on a page index.

4. **Add Filters**:

- Add input fields or buttons to filter data (e.g., show only completed todos).
- Example:

```javascript
state.data.filter((item) => item.completed).forEach(paintCard);
```

5. **Enhance Styling**: - Customize `styles/index.css` to change colors, fonts, or card layouts.

- Add animations for card transitions or loading states.
