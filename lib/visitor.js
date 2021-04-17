


const computeDepthArrayChild = (node, key) => {
  node[key]
};

const computeDepth = (node) => {
  const [keys1, keys2] = estypes[node.type];
  let depth = 0;
  for (let key of keys) {
    node[key]
  }
};

const visit = (node, indent, context) => visitors[node.type](node, indent + 1, context);

const max = (x, y) => x > y ? x : y;

visit = {
  __proto__: null,
  // Program //
  Program: (node) =>
  // Expression //

};

const loop = (node) => {

};

const atomics = [

];

{

const visit = (node) => node.depth = visitors[node.type](node);

const Program = {
  __proto__: null,
  // Program //
  Program: (node) => node.body.map(visit).reduce(max) + 1,
  // Atomic //
  // Expression - Literal //
  Literal: (node) => 0,
  TemplateElement: (node) => 0,
  TemplateExpression: (node) => max(
    node.expressions.map(visit).reduce(max),
    node.quasis.map(visit).reduce(max)),
  TaggedTemplateExpression: (node) => max(
    visit(node.tag),
    visit(node.quasi)),
  ArrowFunctionExpression: (node) => max(
    node.params.map(visit).reduce(max),
    visit(node.body)),
  FunctionExpression: (node) => max(
    node.params.map(visit).reduce(max),
    visit(node.body)),
  // Expression - Environment //
  Identifier: (node) => 0,
  Super: (node) => 0,
  ThisExpression: (node) => 0,
  MetaProperty: (node) => max(
    visit(node.meta),
    visit(node.property)),
  AssignmentExpression: (node) =>
  // Statement //
  ReturnStatement: (node) => (
    node.argument === null ?
    0 :
    visit(node.argument)),

  Debugger: (node) => 0,
  ContinueStatement: (node) => (
    node.label === null ?
    0 :
    visit(node.label)),
  BreakStatement: (node) => (
    node.label === null ?
    0 :
    visit(node.label)),


}

const isAtomic = (node) => (
  node.type === "Literal" ||
  node.type === "Identifier" ||
  (
    node.type === "UnaryExpression" &&
    isAtomic(node.argument)) ||
  (
    node.type === "Await"

const isInline = () => (
  node.type === "MemberExpression"
