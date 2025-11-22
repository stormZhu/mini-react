import React from "./React.js"

const ReactDOM = {
  createRoot(container) {
    // 返回一个函数
    return {
      render(App) {
        React.render(App, container)
      },
    }
  },
}
export default ReactDOM
