
Program = {
  source: "script",
  body: [
    {
      type: "VariableDeclaration",
      kind: "const",
      declarations: [
        {
          type: "VariableDeclaration",
          id: Identifier,
          init: Expression
        }
      ]
    }
  ]
};

Expression = (
  {
    type: "Identifier",
    name: String,
  },
  Predicate,
  {
    type: "Literal",
    regex: {
      pattern: String,
      flags: String
    },
    value: null | RegExp
  },
  {
    type: "Literal",
    value: (null, Boolean, String, Number),
  },
  {
    type: "SequenceExpression",
    expressions: [ Expression, ... Expression ],
  },
  {
    type: "ObjectExpression",
    properties: (
      {
        type: "SpreadElement",
        argument: Expression,
      },
      {
        type: "Property",
        kind: "init",
        computed: false,
        method: false,
        key: (
          {
            type: "Identifier",
            name: String,
          },
          {
            type: "Literal",
            value: String,
          },
        ),
        value: (
          {
            type: "UnaryExpression",
            operator: "~",
            argument: Expression,
          },
          Expression,
        ),
      }
    )
  },
  {
    type: "ArrayExpression",
    elements: (
      {
        type: "SpreadElement",
        argument: Expression,
      },
      {
        type: "UnaryExpression",
        operator: "~",
        argument: Expression,
      },
      Expression,
    ),
  },
);

Elementary = (
  {
    type: "Identifier",
    name: "x"
  },
  {
    type: "Literal",
    value: "Number"
  },
  {
    type: "UnaryExpression",
    operator: "-",
    argument: Elementary
  },
  {
    type: "BinaryExpression",
    operator: ("+", "-", "*", "/", "**", "%"),
    left: Elementary,
    right: Elementary
  }
);

Predicate = (
  {
    type: "BinaryExpression",
    operator: ("===", "!==", "<", "<=", ">", ">="),
    left: Elementary,
    right: Elementary
  },
  {
    type: "BinaryExpression",
    operator: ("&&", "||"),
    left: Predicate,
    right: Predicate
  },
  {
    type: "UnaryExpression",
    operator: "!",
    argument: Elementary
  },
);
