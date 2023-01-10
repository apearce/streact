import * as React from 'react';
import { convertStyleString, DEFAULT_ATTR_MAPPING } from "./helpers";

export default function streact(str, options) {
    const attrMapping = { ...DEFAULT_ATTR_MAPPING, ...options?.attributes};

    function buildTree(node) {
        return node.hasChildNodes() ?
            Array.from(node.childNodes).map((currentNode, child_idx) => {
                if (currentNode.nodeType === Node.TEXT_NODE) {
                    return currentNode.nodeValue;
                }
            
                if (currentNode.nodeType === Node.ELEMENT_NODE) {
                    const attributes = getAttributes(currentNode, child_idx);

                    return React.createElement(
                        currentNode.nodeName.toLowerCase(),
                        attributes,
                        attributes.hasOwnProperty("children") ?
                            attributes.children :
                            buildTree(currentNode)
                    );
                }

                return undefined;
            }) :
            undefined;
    }

    function getAttributes(node, idx) {
        const attributes = { key: idx };
        
        return node.hasAttributes() ?
            Array.from(node.attributes).reduce((attrs, { name, value }) => {
                if (attrMapping && attrMapping.hasOwnProperty(name)) {
                    if (typeof attrMapping[name] === "function") {
                        Object.assign(attrs, attrMapping[name](name, value));
                    } else {
                        attrs[attrMapping[name]] = value;
                    }
                } else {
                    attrs[name] = name === "style" ? convertStyleString(value) : value;
                }
        
                return attrs;
            }, attributes) :
            attributes;
    }

    let rStr = str;

    Object.entries(options?.replacements || {}).forEach(([placeholder, value]) => {
        rStr = rStr.replaceAll(placeholder, value);
    });

	const tpl = document.createElement("template");
	
	tpl.innerHTML = rStr;
	
	return buildTree(tpl.content);
}
