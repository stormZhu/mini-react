// /**@jsx1 CReact.createElement */  // 这样可以修改名称  jsx1 -> jsx
// 这个需要，因为jsx需要使用React
import React from "./core/React.js"

// const App = React.createElement("div", { id: "app" }, "hello mini react")

// const App = function () {
//   return <div>hello mini react</div>
// }
// console.log(App)
const App = <div>hello mini react</div>
export default App
