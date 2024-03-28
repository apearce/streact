import * as React from "react";
import { getAttributes, DEFAULT_ATTR_MAPPING } from "./helpers";
import { AttrMapping, Options, Tree } from "./types";

export default function streact(str: string, options?: Options): Tree {
  const attrMapping = {
    ...DEFAULT_ATTR_MAPPING,
    ...options?.attributes
  } as AttrMapping;

  function buildTree(
    node: Node
  ): Tree {
    return node.hasChildNodes()
      ? Array.from(node.childNodes).map((currentNode, child_idx) => {
          if (currentNode.nodeType === Node.TEXT_NODE) {
            return currentNode.nodeValue;
          }

          if (currentNode.nodeType === Node.ELEMENT_NODE) {
            const attributes = getAttributes(
              currentNode as Element,
              attrMapping,
              child_idx
            );

            return React.createElement(
              currentNode.nodeName.toLowerCase(),
              attributes,
              attributes.hasOwnProperty("children")
                ? attributes.children
                : buildTree(currentNode)
            );
          }

          return undefined;
        })
      : undefined;
  }

  let rStr = str;

  Object.entries(options?.replacements || {}).forEach(
    ([placeholder, value]) => {
      rStr = rStr.replaceAll(placeholder, value);
    }
  );

  const tpl = document.createElement("template");

  tpl.innerHTML = rStr;

  return buildTree(tpl.content);
}
