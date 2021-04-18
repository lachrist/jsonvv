
/////////////
// Program //
/////////////

const Program = {
  type: "Program",
  ... (
    {
      sourceType: "script",
      body: [ ... Statement ]
    } |
    {
      sourceType: "module",
      body: [ ... $ImportDeclaration | $ExportDeclaration | Statement ]
    }
  )
};

const $ImportDeclaration = {
  type: "ImportDeclaration",
  specifiers: [
    ... (
      {
        type: "ImportSpecifier",
        imported: $Identifier,
        local: $Identifier
      } |
      {
        type: "ImportDefaultSpecifier",
        local: $Identifier
      } |
      {
        type: "ImportNamespaceSpecifier",
        local: $Identifier
      }
    )
  ],
  source: $StringLiteral
};

const $ExportDeclaration = (
  {
    type: "ExportNamedDeclaration",
    ... (
      {
        declaration: $VariableDeclaration | $FunctionDeclaration | $ClassDeclaration,
        specifiers: [],
        source: null
      } |
      {
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
  } |
  {
    type: "ExportAllDeclaration",
    source: $StringLiteral
  } |
  {
    type: "ExportDefaultDeclaration",
    declaration: (
      {
        type: "FunctionDeclaration",
        id: null,
        async: Boolean,
        generator: Boolean,
        params: [ ... DeclarativePattern, ~ $DeclarativeRestElement],
        body: $BlockStatement
      } |
      {
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
);

///////////
// Other //
///////////

const $Identifier = {
  type: "Identifier",
  name: String
};

const $StringLiteral = {
  type: "Literal",
  value: String
};

const $DefinitionKey = (
  {
    computed: true,
    key: Expression
  } |
  {
    computed: false,
    key: $Identifier | $StringLiteral
  }
);

const $MemberProperty = (
  {
    computed: true,
    property: Expression
  } |
  {
    computed: false,
    property: $Identifier
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

const $SpreadElement = {
  type: "$SpreadElement",
  argument: Expression
};

const $Property = {
  type: "Property",
  ... $DefinitionKey
};

/////////////
// Pattern //
/////////////

// AssignmentPattern //

const $AssignmentRestElement = {
  type: "RestElement",
  argument: AssignmentPattern
};

const $AssignmentPatternList = [... AssignmentPattern, ~ $AssginmentRestElement];

const AssignmentPattern = (
  $Identifier |
  $NonOptionalMemberExpression | {
    type: "AssignmentPattern",
    left: AssignmentPattern,
    right: Expression
  } | {
    type: "ArrayPattern",
    elements: $AssignmentPatternList
  } | {
    type: "ObjectPattern",
    properties: [
      ... {
        ... $Property,
        kind: "init",
        method: false,
        value: Pattern
      },
      ~ $AssignmentRestElement
    ]
  } | {
    type: "CallExpression",
    optional: false,
    callee: Expression,
    arguments: [... $SpreadElement | Expression ]
  }
);

// DeclarativePattern //

const $DeclarativeRestElement = {
  type: "RestElement",
  argument: DeclarativePattern
};

const $DeclarativePatternList = [ ... DeclarativePattern, ~ $DeclarativeRestElement ];

const DeclarativePattern = (
  $Identifier |
  {
    type: "AssignmentPattern",
    left: DeclarativePattern,
    right: Expression
  } |
  {
    type: "ArrayPattern",
    elements: $DeclarativePatternList,
  } |
  {
    type: "ObjectPattern",
    properties: [
      ... {
        ... $Property,
        kind: "init",
        method: false,
        value: DeclarativePattern
      },
      ~ $DeclarativeRestElement
    ]
  }
);

/////////////////////////
// VariableDeclaration //
/////////////////////////

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

//////////////
// Function //
//////////////

// ArrowFunctionExpression //

const $ArrowExpression = {
  type: "ArrowFunctionExpression",
  async: Boolean,
  params: $DeclarativePatternList,
  ... (
    {
      expression: true,
      body: Expression
    } |
    {
      expression: false,
      body: $BlockStatement
    }
  ),
};

// FunctionDeclaration //

const $FunctionDeclaration = {
  type: "FunctionDeclaration",
  async: Boolean,
  generator: Boolean,
  params: $DeclarativePatternList,
  body: $BlockStatement
};

const $RegularFunctionDeclaration = {
  ... $FunctionDeclaration,
  id: $Identifier
};

const $AnonymousFunctionDeclaration = {
  ... $FunctionDeclaration,
  id: null
};

// FunctionExpression //

const $FunctionExpression = {
  type: "FunctionExpression",
  body: $BlockStatement
};

const $RegularFunctionExpression = {
  ... $FunctionExpression,
  async: Boolean,
  generator: Boolean,
  params: $DeclarativePatternList,
};

const $NameableRegularFunctionExpression = {
  ... $RegularFunctionExpression,
  id: null | $Identifier
};

const $AnonymousRegularFunctionExpression = {
  ... $RegularFunctionExpression,
  id: null
};

const $RestrictedFunctionExpression = {
  ... $FunctionExpression,
  id: null,
  async: false,
  generator: false
};

const $Arity0RestrictedFunctionExpression = {
  ... $RestrictedFunctionExpression,
  params: []
};

const $Arity1RestrictedFunctionExpression = {
  ... $RestrictedFunctionExpression,
  params: [ DeclarativePattern ]
};

const $ArityNRestrictedFunctionExpression = {
  ... $RestrictedFunctionExpression,
  params: $DeclarativePatternList
};

////////////
// Object //
////////////

const $ObjectExpression = {
  type: "ObjectExpression",
  properties: (
    $SpreadElement |
    {
      ... $Property,
      ... (
        {
          kind: "init",
          ... (
            {
              method: true,
              value: $AnonymousFunctionExpression
            } |
            {
              method: false,
              value: Expression
            }
          )
        } |
        {
          kind: "get",
          method: false,
          value: $Arity0RestrictedFunctionExpression
        } |
        {
          kind: "set",
          method: false,
          value: $Arity1RestrictedFunctionExpression
        }
      )
    }
  )
};

///////////
// Class //
///////////

const $ClassExpression = {
  type: "ClassExpression",
  id: null | $Identifier,
  superClass: null | Expression,
  body: $ClassBody
};

const $ClassDeclaration = {
  type: "ClassDeclaration",
  superClass: null | Expression,
  body: $ClassBody
};

const $AnonymousClassDeclaration = {
  ... $ClassDeclaration,
  id: null
};

const $NamedClassDeclaration = {
  ... $ClassDeclaration,
  id: $Identifier
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
          value: $ArityNRestrictedFunctionExpression
        } |
        {
          kind: "method",
          ... $DefinitionKey,
          value: $AnonymousFunctionExpression
        } |
        {
          kind: "get",
          ... $DefinitionKey,
          value: $Arity0RestrictedFunctionExpression
        } |
        {
          kind: "set",
          ... $DefinitionKey,
          value: $Arity1RestrictedFunctionExpression
        }
      )
    }
  ]
};

////////////////
// Expression //
////////////////

const Expression = (
  /* Expression - Environment */ {
    type: "Literal",
    ... (
      {
        value: null | BigInt,
        bigint: String
      } |
      {
        value: null | RegExp,
        regex: {
          pattern: String,
          falgs: String
        }
      } |
      {
        value: null | Boolean | String | Number
      }
    )
  } |
  $TemplateExpression |
  {
    type: "TaggedTemplateExpression",
    tag: Expression,
    quasi: $TemplateExpression
  } |
  $NameableRegularFunctionExpression,
  $ArrowExpression,
  {
    type: "ArrayExpression",
    elements: [ ... $SpreadElement | Expression ]
  } |
  $ClassExpression,
  // Expression - Environment //
  $Identifier |
  {
    type: "Super"
  } |
  {
    type: "ThisExpression"
  } |
  {
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
      } |
      {
        meta: {
          type: "Identifier",
          name: "import"
        },
        property: {
          type: "Identifier",
          name: "meta"
        }
      }
    )
  } |
  {
    type: "AssignmentExpression",
    ... (
      {
        operator: "=",
        left: AssignmentPattern
      } |
      {
        operator: $AssignmentOperator,
        left: $Identifier | $NonOptionalMemberExpression
      }
    ),
    right: Expression,
  } |
  {
    type: "UpdateExpression",
    prefix: Boolean,
    argument: $Identifier | $NonOptionalMemberExpression
  } |
  // Expression - Control //
  {
    type: "SequenceExpression",
    expressions: [ Expression, ... Expressions ]
  } |
  {
    type: "ConditionalExpression",
    test: Expression,
    consequent: Expression,
    alternate: Expression
  } |
  {
    type: "SequenceExpression",
    expressions: [... Expression]
  } |
  {
    type: "LogicalExpression",
    operator: $LogicalOperator,
    left: Expression,
    right: Expression
  } |
  {
    type: "AwaitExpression",
    argument: Expression
  } |
  {
    type: "YieldExpression",
    delegate: Boolean,
    argument: Expression
  } |
  {
    type: "ImportExpression",
    source: Expression
  } |
  // Expression - Combination //
  {
    type: "UnaryExpression",
    prefix: true,
    operator: $UnaryOperator,
    argument: Expression
  } |
  {
    type: "BinaryExpression",
    operator: $BinaryOperator,
    left: Expression,
    right: Expression
  } |
  {
    type: "MemberExpression",
    optional: Boolean,
    object: Expression,
    ... $Property
  } |
  {
    type: "NewExpression",
    callee: Expression,
    arguments: [ ... $SpreadElement | Expression ]
  } |
  {
    type: "CallExpression",
    callee: Expression,
    arguments: [ ... $SpreadElement | Expression ]
  }
);

///////////////
// Statement //
///////////////

const $CatchClause = {
  type: "CatchClause",
  param: null | DeclarativePattern,
  body: $BlockStatement
};

const $SwitchCase = {
  type: "SwitchCase",
  body: [ ... Statement ]
};

const $DefaultSwitchCase = {
  ... $SwitchCase,
  test: null
};

const $ConditionalSwitchCase = {
  ... $SwitchCase,
  test: Expression,
};

const Statement = (
  // Statement - Atomic //
  {
    type: "ReturnStatement",
    argument: null | Expression
  } |
  {
    type: "ThrowStatement",
    argument: Expression
  } |
  {
    type: "BreakStatement",
    label: null | $Identifier
  } |
  {
    type: "ContinueStatement",
    label: null | $Identifier
  } |
  // Statement - Declaration //
  $VariableDeclaration |
  $FunctionDeclaration |
  $ClassDeclaration |
  // Statement - Compound //
  $BlockStatement |
  {
    type: "LabeledStatement",
    label: $Identifier,
    body: Statement
  } |
  {
    type: "IfStatement",
    test: Expression,
    consequent: Statement,
    alternate: null | Statement
  } |
  {
    type: "WhileStatement",
    test: Expression,
    body: Statement
  } |
  {
    type: "DoWhileStatement",
    test: Expression,
    body: Statement
  } |
  {
    type: "ForStatement",
    init: null | $VariableDeclaration | Expression,
    test: null | Expression,
    update: null | Expression,
    body: Statement
  } |
  {
    type: "ForInStatement",
    left: $SingleVariableDeclaration | AssignmentPattern,
    right: Expression,
    body: Statement
  } |
  {
    type: "ForOfStatement",
    await: Boolean,
    left: $SingleVariableDeclaration | AssignmentPattern,
    right: Expression,
    body: Statement
  } |
  {
    type: "TryStatement",
    block: $BlockStatement,
    ... (
      {
        handler: null,
        finalizer: $BlockStatement
      } |
      {
        handler: $CatchClause,
        finalizer: null | $BlockStatement
      }
    )
  } |
  {
    type: "SwitchStatement",
    discriminant: Expression,
    cases: [
      ... $ConditionalSwitchCase,
      ~ $DefaultSwitchCase,
      ... $ConditionalSwitchCase
    ]
  }
);
