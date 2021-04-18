
import getLocation from "./get-location.mjs";

//////////
// Util //
//////////

const primitives = ["Boolean", "String", "Number"];

const getName = ({name}) => name;

const getLeft = ({expression:{left}}) => left;

const getRight = ({expression:{right}}) => right;

const setRight = (node, right) => ({
  ... node,
  expression: {
    ... node.expression,
    right
  }
});

const normalizeRight = (node) => setRight(
  node,
  normalize(
    getRight(node)
  )
);

const isNotNull = (any) => any !== null;

//////////
// Main //
//////////

export default (node) => {
  const names = [
    ... primitives,
    ... node.body.map(getLeft).map(getName)
  ];
  return {
    ... node,
    body: (
      node.body.
      reduce(
        (nodes, _, index1) => {
          const node1 = nodes[index1];
          if (primitives.includes(getLeft(node1).name)) {
            throw new SyntaxError(`at ${getLocation(getLeft(node1))}, duplicate primitive type declaration ${getLeft(node1).name}`);
          }
          checkUndefined(getRight(node1), names);
          nodes.slice(index1 + 1).forEach((node2, index2) => {
            if (getLeft(node2).name === getLeft(node1).name) {
              throw new SyntaxError(`at ${getLocation(getLeft(node2))}, duplicate type declaration ${getLeft(node1).name}`);
            }
          });
          if (!getLeft(node1).name.startsWith("$")) {
            return nodes;
          }
          checkCycle(getRight(node1), getLeft(node1).name);
          return nodes.map((node2, index2) => {
            if (index1 === index2 || node2 === null) {
              return null;
            }
            return setRight(
              node2,
              substitute(
                getRight(node2),
                getLeft(node1),
                getRight(node1),
              ),
            );
          });
        },
        node.body
      ).
      filter(isNotNull).
      map(normalizeRight)
    ),
  };

};

/////////////////
// Environment //
/////////////////

{

  const visit = (node, callback) => visitors[node.type](node, callback);

  const visitors = {
    __proto__: null,
    Identifier: (node, callback) => callback(node),
    Literal: (node, callback) => node,
    BinaryExpression: (node, callback) => node,
    SpreadElement: (node, callback) => ({
      ... node,
      argument: visit(node.argument, callback)
    }),
    UnaryExpression: (node, callback) => ({
      ... node,
      argument: visit(node.argument, callback)
    }),
    Property: (node, callback) => ({
      ... node,
      value: visit(node.value, callback)
    }),
    SequenceExpression: (node, callback) => ({
      ... node,
      expressions: node.expressions.map((node) => visit(node, callback))
    }),
    ObjectExpression: (node, callback) => ({
      ... node,
      properties: node.properties.map((node) => visit(node, callback)),
    }),
    ArrayExpression: (node, callback) => ({
      ... node,
      elements: node.elements.map((node) => visit(node, callback))
    }),
  };
  
  var checkUndefined = (node, names) => visit(
    node,
    (node) => {
      if (!names.includes(node.name)) {
        throw new SyntaxError(`at ${getLocation(node)}, missing type variable ${node.name}`);
      }
      return node;
    },
  );
  
  var checkCycle = (node, name) => visit(
    node,
    (node) => {
      if (node.name === name) {
        throw new SyntaxError(`at ${getLocation(node)}, cycling macro ${node.name}`);
      }
      return node;
    },
  );

  var substitute = (node, left, right) => visit(
    node,
    (node) => {
      if (node.name === left.name) {
        return right;
      }
      return node;
    },
  );

}

///////////////
// Normalize //
///////////////

{

  const box = (nodes) => {
    /* c8 ignore start */
    if (nodes.length === 0) {
      throw new Error(`Unexpected empty array`);
    }
    /* c8 ignore stop */
    if (nodes.length == 1) {
      return nodes[0];
    }
    return {
      type: "SequenceExpression",
      expressions: nodes
    };
  };
  
  const unbox = (node) => {
    if (node.type === "SequenceExpression") {
      return node.expressions;
    }
    return [node]
  };

  const combineProperty = (propertiess, property) => {
    if (property.type === "SpreadElement") {
      return unbox(visit(property.argument)).flatMap((node) => {
        if (node.type !== "ObjectExpression") {
          throw new SyntaxError(`at ${getLocation(node)}, expected an ObjectExpression instead of a ${node.type}`);
        }
        return propertiess.map(
          (properties) => [
            ... properties,
            ... node.properties
          ]
        );
      });
    }
    if (property.value.type === "UnaryExpression") {
      return propertiess.flatMap(
        (properties) => [
          properties,
          [
            ...properties,
            {
              ... property,
              value: visit(property.value.argument)
            }
          ]
        ]
      );
    }
    return propertiess.map(
      (properties) => [
        ... properties,
        {
          ... property,
          value: visit(property.value),
        }
      ]
    );
  };
  
  const visit = (node) => visitors[node.type](node);

  const visitors = {
    __proto__: null,
    Identifier: (node) => node,
    Literal: (node) => node,
    BinaryExpression: (node) => node,
    SequenceExpression: (node) => ({
      ... node,
      expressions: node.expressions.map(visit).flatMap(unbox)
    }),
    SpreadElement: (node) => ({
      ... node,
      argument: visit(node.argument)
    }),
    UnaryExpression: (node) => ({
      ... node,
      argument: visit(node.argument)
    }),
    ArrayExpression: (node) => ({
      ... node,
      elements: node.elements.map(visit)
    }),
    ObjectExpression: (node, callback) => box(
      node.properties.reduce(combineProperty, [[]]).map((properties) => ({
        ... node,
        properties
      }))
    ),
  };

  var normalize = visit;

}
