type AttrResultFunction = (n: string, v: string) => { [k: string]: number | string };
type AttrMapping = { [k: string]: AttrResultFunction | string };
type Tree = (string | React.DOMElement<{}, Element> | null | undefined)[] | undefined;

interface Options {
  attributes?: AttrMapping;
  replacements?: { [k: string]: string };
}

export { AttrMapping, AttrResultFunction, Options, Tree };
