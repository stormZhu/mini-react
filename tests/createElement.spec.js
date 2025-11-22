import { it, expect, describe } from "vitest"
import React from "../src/core/React.js"

describe("createElement", () => {
  it("props is null", () => {
    const el = React.createElement("div", null, "hello mini react")
    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hello mini react",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
        },
        "type": "div",
      }
    `)

    expect(el).toEqual({
      type: "div",
      props: {
        children: [
          {
            type: "TEXT_ELEMENT",
            props: {
              nodeValue: "hello mini react",
              children: [],
            },
          },
        ],
      },
    })
  })

  it("should return element vdom", () => {
    const el = React.createElement("div", { id: "app" }, "hello mini react")
    expect(el).toMatchInlineSnapshot(`
      {
        "props": {
          "children": [
            {
              "props": {
                "children": [],
                "nodeValue": "hello mini react",
              },
              "type": "TEXT_ELEMENT",
            },
          ],
          "id": "app",
        },
        "type": "div",
      }
    `)
  })
})
