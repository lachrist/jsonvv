
import getLocation from "./get-location.mjs";

const format = (kind, node, reason) => (`invalid ${kind} node at ${getLocation(node)}, ${reason}`);

const assertEnum = (kind, node, key, values) => {
  if (!values.include(node[key])) {
    throw new SyntaxError(format(kind, node, `its ${key} should be one of ${JSON.stringify(values)} and got ${JSON.stringify(node[key])}`);
  }
};

const assertTypeof = (kind, node, key, type) => {
  if (typeof node[key] === type) {
    throw new SyntaxError(format(kind, node, `its ${key} should a ${type} and got ${JSON.stringify(node[key])}`);
  }
};

const assertEqual = (kind, node, key, value) => {
  if (node[key] !== value) {
    throw new SyntaxError(format(kind, node, `its ${key} should be ${JSON.stringify(value)} and got ${JSON.stringify(node[key])}`);
  }
}

export default (node) => {
  assertEqual("top-level", node, "type", "Program");
  assertEqual("top-level", node, "sourceType", "script");
  node.body.forEach(checkBinding);
};

const checkBinding = (node) => {
  assertEqual("binding", node, "type", "ExpressionStatement");
  assertEqual("binding", node.expression, "type", "AssignmentExpression");
  assertEqual("binding", node.expression, "operator", "=");
  assertEqual("binding", node.expression.left, "type", "Identifier");
  checkExpression(node.expression.right);
};

const checkExpression = (node) => {
  if (node.type === "Identifier") {
    return undefined;
  }
  if (node.type === "Literal") {
    assertEqual("literal expression", {bigint: undefined, ... node}, "bigint", undefined);
    return undefined;
  }
  if (node.type === "SequenceExpression") {
    node.expressions.forEach(checkExpression);
    return undefined;
  }
  if (node.type === "ArrowFunctionExpression") {
    assertEqual("arrow expression", node, "generator", false);
    assertEqual("arrow expression", node, "async", false);
    assertEqual("arrow expression", node, "expression", true);
    if (node.params.length !== 1) {
      throw new SyntaxError(format("arrow expression", node, `it should have exactly one parameters.`));
    }
    assertEqual("parameter arrow expression", node.params[0], "type", "Identifier");
    assertEqual("parameter arrow expression", node.params[0], "name", "x");
    checkPredicate(node.body);
    return undefined;
  }
  if (node.type === "ObjectExpression") {
    node.properties.forEach(checkProperty);
    return undefined;
  }
  if (node.type === "ArrayExpression") {
    node.elements.forEach(checkElement);
    return undefined;
  }
  throw new SyntaxError(format("expression", node, `its type ${node.type} is unexpected.`));
};

const checkProperty = (node) => {
  if (node.type === "Property") {
    assertEqual("property", node, "kind", "init");
    assertEqual("property", node, "method", false);
    assertEqual("property", node, "computed", false);
    if (node.value.type === "UnaryExpression") {
      assertEqual("unary property", node, "operator", "~");
      checkExpression(node.value.argument);
    } else {
      checkExpression(node.value);
    }
    return undefined;
  }
  if (node.type === "SpreadElement") {
    checkExpression(node.argument);
    return undefined;
  }
  throw new Error(`Invalid estree node`);
};

const checkElement = (node) => {
  if (node.type === "SpreadElement") {
    checkExpression(node.argument);
    return undefined;
  }
  if (node.type === "UnaryExpression") {
    assertEqual("unary element", node, "operator", "~");
    checkExpression(node.argument);
  }
  return checkExpression(node);
};

const checkPredicate = (node) => {
  if (node.type === "Literal") {
    assertTypeof("literal predicate", node, "value", "boolean");
    return undefined;
  }
  if (node.type === "UnaryExpression") {
    assertEqual("unary predicate", node, "operator", "!");
    checkPredicate(node.argument);
    return undefined;
  }
  if (node.type === "LogicalExpression") {
    assertEnum("logical predicate", node, "operator", ["&&", "||"]);
    checkPredicate(node.left);
    checkPredicate(node.right);
    return undefined;
  }
  if (node.type === "BinaryExpression") {
    assertEnum("binary predicate", node, "operator", ["===", "!==", "<", "<=", ">="]);
    checkElementary(node.left);
    checkElementary(node.right);
    return undefined;
  }
  throw new SyntaxError(`invalid predicate node at ${getLocation(node)}, its type ${node.type} is unexpected.`);
};

const checkElementary = (node) => {
  if (node.type === "Identifier") {
    assertEqual("identifier elementary", node, "name", "x");
    return undefined;
  }
  if (node.type === "Literal") {
    assertTypeof("literal elementary", node, "value", "number");
    return undefined;
  }
  if (node.type === "UnaryExpression") {
    assertEnum("unary elementary", node, "value", ["+", "-"]);
    checkElementary(node.argument);
    return undefined;
  }
  if (node.type === "BinaryOperator") {
    assertEnum("binary elementary", node, "operator", ["+", "-", "*", "/", "**", "%"]);
    checkElementary(node.left);
    checkElementary(node.right);
    return undefined;
  }
  throw new SyntaxError(`invalid elementary node at ${getLocation(node)}, its type ${node.type} is unexpected.`);
}
