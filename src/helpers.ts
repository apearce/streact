import { AttrMapping, AttrResultFunction } from "./types";

function convertProperty(property: string) {
  return property.startsWith("--")
    ? property
    : property
        .replace(/^-ms/, "ms")
        .replace(/-([a-z])/g, (m, p1) => p1.toUpperCase());
}

function convertStyleString(str: string) {
  return str
    .trim()
    .replace(/;$/, "")
    .split(/ *; */)
    .reduce((obj, s) => {
      const [property, ...value] = s.split(/ *: */);

      obj[convertProperty(property)] = value.join(":");

      return obj;
    }, {} as { [k: string]: string });
}

export function getAttributes(
  node: Element,
  attrMapping: AttrMapping,
  idx: number
): { [k: string]: any } {
  const attributes = { key: idx };

  return node.hasAttributes()
    ? Array.from(node.attributes).reduce(
        (attrs: { [k: string]: any }, { name, value }) => {
          if (attrMapping && attrMapping.hasOwnProperty(name)) {
            if (typeof attrMapping[name] === "function") {
              Object.assign(
                attrs,
                (attrMapping[name] as AttrResultFunction)(name, value)
              );
            } else {
              attrs[attrMapping[name] as string] = value;
            }
          } else {
            attrs[name] = name === "style" ? convertStyleString(value) : value;
          }

          return attrs;
        },
        attributes
      )
    : attributes;
}

export const DEFAULT_ATTR_MAPPING = {
  class: "className"
};
