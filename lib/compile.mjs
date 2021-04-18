
//////////
// Util //
//////////

const primitives = ["Boolean", "String", "Number"];

const getName = ({name}) => name;

const getLeft = ({declarations:[{id}]}) => id;

const getRight = ({declarations:[{init}]}) => init;

const setRight = (node, init) => ({
  ... node,
  declarations: [{
    ... node.declarations[0],
    init
  }]
});

const normalizeRight = (node) => setRight(
  node,
  normalize(
    getRight(node)
  )
);

const isNotNull = (any) => any !== null;

const getLocation = (node) => {
  if (Reflect.getOwnPropertyDescriptor(node, "loc") === undefined) {
    return "???";
  }
  return String(node.loc.start.line);
};

//////////
// Main //
//////////

export default (node) => {
  const names = [
    ... primitives,
    ... nodes.map(getLeft).map(getName)
  ];
  return {
    ... node,
    body: (
      node.body.
      reduce(
        (nodes, node1, index1) => {
          if (primitives.includes(getLeft(node1))) {
            throw new SyntaxError(`at ${getLocation(getLeft(node1))}, redeclaration of primitive type`);
          }
          checkUndefined(getRight(node1), names);
          nodes.slice(index1 + 1).forEach((node2, index2) => {
            if (getLeft(node2).name === getLeft(node1).name) {
              throw new SyntaxError(`at ${getLocation(getLeft(node2))}, duplicate type declaration`);
            }
          });
          if (!getLeft(node1).name.startWith("$")) {
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
                getRight(nodes2),
                getLeft(node1).name,
                getRight(node1)
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
      argument: visit(node, callback)
    }),
    UnaryExpression: (node, callback) => ({
      ... node,
      argument: visit(node, callback)
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
      properties: node.properties.map((node) => visit(node, callback));
    }),
    ArrayExpression: (node, callback) => ({
      ... node,
      elements: node.elements.map((node) => visit(node, callback))
    }),
  };
  
  var checkUndefined = (node, names) => visit(
    (node) => {
      if (!names.has(node.name)) {
        throw new SyntaxError(`at ${getLocation(node)}, missing variable ${node.name} `);
      }
      return node;
    },
    node
  );
  
  var checkCycle = (node, name) => visit(
    (node) => {
      if (node.name === name) {
        throw new SyntaxError(`at ${getLocation(node)}, cycling macro ${node.name}`);
      }
      return node;
    },
    node,
  );

  var substitute = (node, left, right) => visit(
    (node) => {
      if (node.name === left.name) {
        return right;
      }
      return node;
    },
    node,
  );

}

///////////////
// Normalize //
///////////////

{

  const box = (nodes) => {
    if (nodes.length === 0) {
      throw new Error(`Unexpected empty array`);
    }
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
  
  const combineProperty = (properties, property) => {
    if (property.type === "SpreadElement") {
      return unbox(visit(property.argument)).map((node) => {
        if (node.type !== "ObjectExpression") {
          throw new SyntaxError(`at ${getLocation(node)}, expected an ObjectExpression instead of a ${node.type}`);
        }
        return [
          ... properties,
          ... node.properties
        ];
      });
    }
    if (property.value.type === "UnaryExpression") {
      return [
        properties,
        [
          ...properties,
          {
            ... property,
            value: visit(property.value.argument)
          }
        ]
      ];
    }
    return [
      [
        ... properties,
        {
          ... property,
          value: visit(property.value),
        }
      ]
    ];
  };

  const visitors = {
    __proto__ null,
    Identifier: (node) => node,
    Literal: (node) => node,
    BinaryExpression: (node) => node,
    SequenceExpression: (node) => ({
      ... node,
      expressions: node.map(visit).flatMap(flaten)
    }),
    SpreadElement: (node) => ({
      ... node,
      argument: visit(node)
    }),
    UnaryExpression: (node) => ({
      ... node,
      argument: visit(node)
    }),
    ArrayExpression: (node) => ({
      ... node,
      elements: node.elements.map(visit)
    }),
    ObjectExpression: (node, callback) => box(
      node.properties.flatMap(combineProperty, []).map((properties) => ({
        ... node,
        properties
      }))
    ),
  };

  var normalize = visit;

}
