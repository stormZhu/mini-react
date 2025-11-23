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
        const isTextNode =
          typeof child === "string" || typeof child === "number"
        return isTextNode ? createTextNode(child) : child
      }),
    },
  }
}

let nextWorkOfUnit = null
let root = null
let currentRoot = null
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
  currentRoot = root
  root = null
}

function commitWork(fiber) {
  if (!fiber) {
    return
  }
  if (fiber.effectTag === "update") {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  } else if (fiber.effectTag === "placement") {
    // 如果当前节点是function component，它没有dom
    if (fiber.dom) {
      // 一个节点的parent，可能是function component，没有dom，所以需要继续往上找他的parent
      let fiberParent = fiber.parent
      while (!fiberParent.dom) {
        fiberParent = fiberParent.parent
      }
      fiberParent.dom.append(fiber.dom)
    }
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

function updateProps(dom, nextProps, prevProps) {
  // {id: "1"}  {}
  // 1. old 有, new没有，删除
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        dom.removeAttribute(key)
      }
    }
  })
  // 2.new有，old没有，添加
  // 3. new有old you，修改
  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith("on")) {
          const eventType = key.slice(2).toLowerCase()
          dom.removeEventListener(eventType, prevProps[key]) // 记得移除旧的事件
          dom.addEventListener(eventType, nextProps[key])
        } else {
          dom[key] = nextProps[key]
        }
      }
    }
  })
}

function initChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child
  let preChild = null
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type
    let newFiber = null
    if (isSameType) {
      // update
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: "update",
        alternate: oldFiber,
      }
    } else {
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: null,
        effectTag: "placement",
      }
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      preChild.sibling = newFiber
    }
    preChild = newFiber
  })
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)]
  initChildren(fiber, children)
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type))
    // 2. 设置props
    updateProps(dom, fiber.props, {})
  }
  initChildren(fiber, fiber.props.children)
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === "function"
  if (!isFunctionComponent) {
    updateHostComponent(fiber)
  } else {
    updateFunctionComponent(fiber)
  }

  // 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child
  }

  // fix: parent可能没有sibling，需要一直往上
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
  return nextFiber
}

requestIdleCallback(workLoop)

function update() {
  nextWorkOfUnit = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  }
  root = nextWorkOfUnit
}

const React = {
  render,
  createElement,
  update,
}

export default React
