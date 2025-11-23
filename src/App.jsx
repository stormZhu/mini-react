// /**@jsx1 CReact.createElement */  // 这样可以修改名称  jsx1 -> jsx
// 这个需要，因为jsx需要使用React
import React from "./core/React.js"

function Counter({ num }) {
  return <div>counter: {num}</div>
}

// function CounterContainer() {
//   return <Counter />
// }

function App() {
  return (
    <div>
      hello mini react
      <Counter num={10} />
      <Counter num={20} />
    </div>
  )
}
// const App = (
//   <div>
//     hello mini react
//     <CounterContainer />
//   </div>
// )
export default App
