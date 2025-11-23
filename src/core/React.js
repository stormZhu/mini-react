function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === "string" ? createTextNode(child) : child
      }),
    },
  }
}

let nextWorkOfUnit = null
let root = null
function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  }
  root = nextWorkOfUnit
}

function workLoop(deadline) {
  let shouldYield = false
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextWorkOfUnit && root) {
    commitRoot()
  }

  requestIdleCallback(workLoop)
}

function commitRoot() {
  commitWork(root.child)
  root = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }

  // 如果当前节点是function component，它没有dom
  if (fiber.dom) {
    // 一个节点的parent，可能是function component，没有dom，所以需要继续往上找他的parent
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent
    }
    fiberParent.dom.append(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

function createDom(type) {
  // console.log("createDom", type)
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type)
}

function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    if (key !== "children") {
      dom[key] = props[key]
    }
  })
}

function initChildren(fiber, children) {
  let preChild = null
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      preChild.sibling = newFiber
    }
    preChild = newFiber
  })
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function"
  if (!isFunctionComponent) {
    // 1. 创建dom
    if (!fiber.dom) {
      const dom = (fiber.dom = createDom(fiber.type))
      // fiber.parent.dom.append(dom) // 放入dom中，改为后面统一提交
      // 2. 设置props
      updateProps(dom, fiber.props)
    }
  }

  // 3. 转换链表，设置好指针
  const children = isFunctionComponent ? [fiber.type()] : fiber.props.children
  initChildren(fiber, children)

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }
  if (fiber.sibling) {
    return fiber.sibling
  }
  return fiber.parent?.sibling
}

requestIdleCallback(workLoop)

const React = {
  render,
  createElement,
}

export default React
