
const Program = {
  type: "Program",
  ... (
    {
      sourceType: "script",
      body: [ ... Statement ]
    } | {
      sourceType: "module",
      body: [ ... $ModuleDeclaration | Statement ]
    }
  )
};

const $Identifier = {
  type: "Identifier",
  name: String
};

const $StringLiteral = {
  type: "Literal",
  value: String
};

const $Key = (
  {
    computed: true,
    key: Expression
  } | {
    computed: false,
    key: $Identifier | $StringLiteral
  }
);

const $Property =  (
  {
    computed: true,
    key: Expression
  } | {
    computed: false,
    key: $Identifier
  }
);

const $NonOptionalMemberExpression = {
  type: "MemberExpression",
  optional: false,
  object: Expression,
  ... $Property
};

const $TemplateExpression = {
  type: "TemplateExpression",
  expressions: [ ... Expression ],
  quasis: [
    ... {
      type: "TemplateElement",
      tail: false,
      value: {
        raw: String,
        cooked: String
      }
    },
    {
      type: "TemplateElement",
      tail: true,
      value: {
        raw: String,
        cooked: String
      }
    }
  ]
};

const $RestElementPattern = {
  type: "RestElement",
  argument: Pattern
};

const $RestElementDeclarativePattern = {
  type: "RestElement",
  argument: DeclarativePattern
};

const Pattern = (
  $Identifier |
  $NonOptionalMemberExpression | {
    type: "AssignmentPattern",
    left: Pattern,
    right: Expression
  } | {
    type: "ArrayPattern",
    elements: [
      ... Pattern,
      ~ $RestElementPattern
    ]
  } | {
    type: "ObjectPattern",
    properties: [
      ... {
        type: "Property",
        kind: "init",
        method: false,
        ... $Key,
        value: Pattern
      },
      ~ $RestElementPattern
    ]
  } | {
    type: "CallExpression",
    optional: false,
    callee: Expression,
    arguments: [... $SpreadElement | Expression ]
  }
);

const DeclarativePattern = (
  $Identifier | {
    type: "AssignmentPattern",
    left: DeclarativePattern,
    right: Expression
  } | {
    type: "ArrayPattern",
    elements: [
      ...DeclarativePattern,
      ~ $RestElementDeclarativePattern
    ]
  } | {
    type: "ObjectPattern",
    properties: [
      ... {
        type: "Property",
        kind: "init",
        method: false,
        ... $Key,
        value: DeclarativePattern
      },
      ~ $RestElementDeclarativePattern
    ]
  }
);

const $SpreadElement = {
  type: "$SpreadElement",
  argument: Expression
};

const $ClassBody = {
  type: "ClassBody",
  methods: [
    ... {
      type: "MethodDefinition",
      static: Boolean,
      ... (
        {
          kind: "constructor",
          computed: false,
          key: {
            type: "Identifier",
            name: "constructor"
          },
          value: {
            type: "FunctionExpression",
            async: false,
            generator: false,
            params: [
              ... DeclarativePattern,
              ~ $DeclarativeRestElement
            ],
            body: $BlocKStatement
          }
        } | {
          kind: "method" | "get" | "set",
          ... $Key,
          value: $MethodFunctionExpression
        }
      )
    }
  ]
};

const Expression = (
  /* Expression - Environment */ {
    type: "Literal",
    ... (
      {
        value: null | BigInt,
        bigint: String
      } | {
        value: null | RegExp,
        regex: {
          pattern: String,
          falgs: String
        }
      } | {
        value: null | boolean | string | number
      }
    )
  } |
  $TemplateExpression | {
    type: "TaggedTemplateExpression",
    tag: Expression,
    quasi: $TemplateExpression
  } | {
    type: "FunctionExpression",
    generator: boolean,
    async: boolean,
    id: null | Identifier,
    params: [
      ... DeclarativePattern,
      ~ {
        type: "RestElement",
        argument: DeclarativePattern
      }
    ],
    body: {
      type: "BlockStatement",
      body: [... Statement]
    }
  } | {
    type: "ArrowFunctionExpression",
    async: boolean,
    params: [
      ... DeclarativePattern,
      ~ {
        type: "RestElement",
        argument: DeclarativePattern
      }
    ],
    body: (
      {
        type: "BlockStatement",
        body: [ ... Statement ]
      } |
      Expression
    )
  } | {
    type: "ArrayExpression",
    elements: [ ... $SpreadElement | Expression ]
  } | {
    type: "ObjectExpression",
    properties: (
      $SpreadElement |
      {
        type: "Property",
        ... (
          {
            computed: true,
            key: Expression
          } | {
            computed: false,
            key: $NonComputedKey
          }
        ),
        ... (
          {
            kind: "init",
            ... (
              {
                method: true,
                value: {
                  type: "FunctionExpression",
                  async: Boolean,
                  generator: Boolean,
                  id: null,
                  params: [
                    ...DeclarativePattern,
                    ~$DeclarativeRestElement
                  ],
                  body: $BlocKStatement
                }
              } |
              {
                method: false,
                value: Expression
              }
            )
          } | {
            kind: "get",
            method: false,
            value: {
              type: "FunctionExpression",
              async: false,
              generator: false,
              id: null,
              params: [],
              body: $BlocKStatement
            }
          } | {
            kind: "set",
            method: false,
            value: {
              type: "FunctionExpression",
              async: false,
              generator: false,
              id: null,
              params: [DeclarativePattern],
              body: $BlocKStatement
            }
          }
        )
      }
    )
  } | {
    type: "ClassExpression",
    id: null | $Identifier,
    superClass: null | Expression,
    body: $BodyClass
  } | /* Expression - Environment */
  $Identifier | {
    type: "Super"
  } | {
    type: "ThisExpression"
  } | {
    type: "MetaProperty",
    ... (
      {
        meta: {
          type: "Identifier",
          name: "new"
        },
        property: {
          type: "Identifer",
          name: "target"
        }
      } | {
        meta: {
          type: "Identifier",
          name: "import"
        },
        property: {
          type: "Identifer",
          name: "meta"
        }
      }
    )
  } | {
    type: "AssignmentExpression",
    ... (
      {
        operator: "=",
        left: Pattern
      } | {
        operator: $AssignmentOperator,
        left: $Identifier | $NonOptionalMemberExpression
      }
    ),
    right: Expression,
  } | /* Expression - Control */ {
    type: "ConditionalExpression",
    test: Expression,
    consequent: Expression,
    alternate: Expression
  } | {
    type: "SequenceExpression",
    expressions: [... Expression]
  } | {
    type: "LogicalExpression",
    operator: $LogicalOperator,
    left: Expression,
    right: Expression
  } | {
    type: "AwaitExpression",
    argument: Expression
  } | {
    type: "YieldExpression",
    delegate: Boolean,
    argument: Expression
  } | {
    type: "ImportExpression",
    source: Expression
  } | /* Expression - Combination */ {
    type: "UnaryExpression",
    prefix: true,
    operator: $UnaryOperator,
    argument: Expression
  } | {
    type: "BinaryExpression",
    operator: $BinaryOperator,
    left: Expression,
    right: Expression
  } | {
    type: "MemberExpression",
    optional: boolean,
    object: Expression,
    ... (
      {
        computed: true,
        property: Expression
      } | {
        computed: false,
        property: $Identifier | $StringLiteral
      }
    )
  } | {
    type: "NewExpression",
    callee: Expression,
    arguments: [ ... $SpreadElement | Expression ]
  } | {
    type: "CallExpression",
    callee: Expression,
    arguments: [ ... $SpreadElement | Expression ]
  }
);

const $Declarator: {
  type: "Declarator",
  id: DeclarativePattern,
  init: null | Expression
};

const $VariableDeclaration = {
  type: "VariableDeclaration",
  kind: "var" | "let" | "const",
  declarations: [ ... $Declarator ]  
};

const $SingleVariableDeclaration = {
    type: "VariableDeclaration",
    kind: "var" | "let" | "const",
    declarations: [
      {
        type: "Declarator",
        id: DeclarativePattern,
        init: null
      }
    ]
};

const Statement = (
  /* Atomic */ {
    type: "ReturnStatement",
    argument: null | Expression
  } | {
    type: "ThrowStatement",
    argument: Expression
  } | {
    type: "BreakStatement",
    label: null | $Identifier
  } | {
    type: "ContinueStatement",
    label: null | $Identifier
  } | /* Declaration */
  $VariableDeclaration | {
    type: "FunctionDeclaration",
    id: $Identifier,
  } | {
    type: "ClassDeclaration",
    id: $Identifier,
    superClass: null | Expression,
    body: ... $ClassBody
  } | /* Compound */
  $BlocKStatement | {
    type: "LabeledStatement",
    label: $Identifier,
    body: Statement
  } | {
    type: "IfStatement",
    test: Expression,
    consequent: Statement,
    alternate: null | Statement
  } | {
    type: "WhileStatement",
    test: Expression,
    body: Statement
  } | {
    type: "DoWhileStatement",
    test: Expression,
    body: Statement
  } | {
    type: "ForStatement",
    init: null | $VariableDeclaration | Expression,
    test: null | Expression,
    update: null | Expression,
    body: Statement
  } | {
    type: "ForInStatement",
    left: $SingleVariableDeclaration | Pattern,
    right: Expression,
    body: Statement
  } | {
    type: "ForOfStatement",
    await: Boolean,
    left: $SingleVariableDeclaration | Pattern,
    right: Expression,
    body: Statement
  } | {
    type: "TryStatement",
    block: $BlocKStatement,
    handler: (
      null |
      {
        type: "CatchClause",
        param: null | DeclarativePattern,
        body: $BlockStatement
      }
    ),
    finalizer: null | $BlocKStatement
  } | {
    type: "SwitchStatement",
    discriminant: Expression,
    cases: [
      ... {
        type: "SwitchCase",
        test: null | Expression,
        body: [ ... Statement ]
      }
    ]
  }
);

const ModuleDeclaration = (
  {
    type: "ImportDeclaration",
    specifiers: [
      ... (
        {
          type: "ImportSpecifier",
          imported: $Identifier,
          local: $Identifier
        } | {
          type: "ImportDefaultSpecifier",
          local: $Identifier
        } | {
          type: "ImportNamespaceSpecifier",
          local: $Identifier
        }
      )
    ],
    source: $StringLiteral
  } | {
    type: "ExportNamedDeclaration",
    ... (
      {
        declaration: $VariableDeclaration | $FunctionDeclaration | $ClassDeclaration,
        specifiers: [],
        source: null
      } | {
        declaration: null,
        specifiers: [
          ... {
            type: "ExportSpecifier",
            local: $Identifier,
            exported: $Identifier
          }
        ],
        source: null | $StringLiteral
      }
    )
  } | {
    type: "ExportAllDeclaration",
    source: $StringLiteral
  } | {
    type: "ExportDefaultDeclaration",
    declaration: (
      {
        type: "FunctionDeclaration",
        id: null,
        async: Boolean,
        generator: Boolean,
        params: [ ... DeclarativePattern, ~ $DeclarativeRestElement],
        body: $BlocKStatement
      } | {
        type: "ClassDeclaration",
        id: null,
        superClass: null | Expression,
        body: $ClassBody
      } |
      $ClassDeclaration |
      $FunctionDeclaration |
      Expression
    )
  }
};
