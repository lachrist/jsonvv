
export default = (node) => {
  if (Reflect.getOwnPropertyDescriptor(node, "loc") === undefined) {
    return "???";
  }
  return `line ${String(node.loc.start.line)} column ${String(node.loc.start.column)}`;
};
