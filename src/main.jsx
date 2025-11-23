import React from "./core/React.js"
import ReactDOM from "./core/ReactDom.js"
import App from "./App.jsx"

// 需要支持function component
ReactDOM.createRoot(document.querySelector("#root")).render(<App />)
// ReactDOM.createRoot(document.querySelector("#root")).render(App)
