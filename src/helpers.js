function convertProperty(property) {
    return property.startsWith("--") ? 
        property :
        property
            .replace(/^-ms/, "ms")
            .replace(/-([a-z])/g, (m, p1) => p1.toUpperCase());
}

export function convertStyleString(str) {
    return str.trim().replace(/;$/, '').split(/ *; */).reduce((obj, s) => {
        const [property, ...value] = s.split(/ *: */);

        obj[convertProperty(property)] = value.join(":");
      
        return obj;
    }, {});
}

export const DEFAULT_ATTR_MAPPING = {
    "class": "className"
};
