
export const Node = [
  "Either",
  "Identifier",
  "Source",
  "TemplateElement",
  "CatchClause",
  "SwitchCase",
  "Program",
  "Statement",
  "Expression",
  "Pattern"
];

export const string = (value) => typeof value === "string";

export const boolean = (value) => typeof value === "boolean";

const check = (value, type) => {
  if (Array.isArray(type)) {
    // console.assert(type.length > 0 && typeof type[0] === "string")
    if (type[0] === "Maybe") {
      // console.assert(type.length === 2)
      if (value === null) {
        return true;
      }
      return check(value, type[1]);
    }
    if (type[0] === "Either") {
      for (let index = 0; index < type.length; index++) {
        if (check(value, type)) {
          return true;
        }
      }
      return false;
    }
    if (type[0] === "Constant") {
      // console.assert(type.length === 2 && type[1] === null || typeof type[1] === "boolean" || typeof type[1] === "number" || typeof type[1] === "string")
      return value === type[1];
    }
  }
  if (typeof type === "object" && type !== null) {
    if (typeof value !== "object" || value === null) {
      return false;
    }
    for (const key in type) {
      if (Reflect.getOwnPropertyDescriptor(value, type) === undefined) {
        return false;
      }
      if (!check(value[key], type[key])) {
        return false;
      }
    }
  }






  if (Array.isArray(value)) {

  }
  i
  if (typeof value) {

  }


  for (const type of types) {
    // console.assert(type.type[0] === "Constant")
    if (node.type === type.type[1]) {
      for (const key in type) {
        if (Reflect.getOwnPropertyDescriptor(value, type) === undefined) {
          return false;
        }
        if (!check(value[key], type[key])) {
          return false;
        }
      }
    }
  }
};

export const Program = {
  type: ["Constant", "Program"],
  sourceType: [
    "Either",
    ["Constant", "script"],
    ["Constant", "module"]
  ],
  body: ["Array", "Statement"]
};

export const Identifier = {
  type: ["Constant", "Identifier"],
  name: "string"
};

export const Source = {
  type: ["Constant", "Literal"],
  value: "string"
};

export const TemplateElement = {
  type: ["Constant", "TemplateElement"],
  raw: "string",
  cooked: "string"
};




"Expression" = {
  Identifier: {
    name: "String"
  },
};

export const Expression = [
  "Either",
  {
    type: ["Constant", "Identifier"],
    name: "string"
  },
  {




];



const estypes = {
  // Program //
  Program: {
    type: ["Constant", "Program"],
    sourceType: [
      "Either",
      ["Constant", "script"],
      ["Constant", "module"]
    ],
    body: ["Array", "Statement"],
  },
  // Expression - Literal //
  Literal: [
    "Either",
    {
      type: ["Constant", "Literal"],
      value: "bigint",
      bigint: "string"
    },
    {
      type: ["Constant", "Literal"],
      value: "RegExp",
      regex: {
        pattern: "string",
        flags: "string"
      }
    },
    {
      type: ["Constant", "Literal"],
      value: [
        "Either",
        ["const", null],
        "boolean",
        "string",
        "number"
      ]
    }
  ],
  TemplateElement: {
    type: ["Constant", "TemplateElement"],
    raw: "string",
    cooked: "string"
  },
  TemplateExpression: {
    type: ["Constant", "TemplateExpression"],
    expressions: ["Array", "Expression"],
    quasis: ["Array", "TemplateElement"]
  },
  TaggedExpression: {
    type: ["Constant", "TaggedTemplateExpression"],
    tag: "Expression",
    quasi: "TemplateExpression"
  },
  FunctionExpression: {
    type: ["Constant", "FunctionExpression"],
    generator: "boolean",
    async: "boolean",
    id: [
      "Either",
      ["Constant", null],
      "Identifier"
    ],
    params: ["Array", "Pattern"],
    body: "BlockStatement"
  },
  ArrowFunctionExpression: {
    type: ["Constant", "ArrowFunctionExpression"],
    async: "boolean",
    params: ["Array", "Pattern"],
    body: ["Either", "Expression", "BlockStatement"]
  },
  ArrayExpression: {
    type: ["Constant", "ArrayExpression"],
    properties: ["Array", ["Maybe", ["Either", "SpreadElement", "Expression"]]]
  },
  ObjectExpression: {
    type: ["Constant", "ObjectExpression"],
    properties: ["Array", ["Either", "SpreadElement", "Property"]]
  },
  // Expression - Environment //
  Super: {
    type: ["Constant", "Super"]
  },
  ThisExpression: {
    type: ["Constant", "ThisExpression"]
  },
  MetaProperty: {
    meta: "Identifier",
    property: "Identifier"
  },
  AssignmentExpression: [
    "Either",
    {
      type: ["Constant", "AssignmentExpression"],
      operator: "=",
      left: "Pattern",
      right: "Expression"
    },
    {
      type: ["Constant", "AssignmentExpression"],
      operator: "AssignmentOperator",
      left: ["Either", "CallExpression", "MemberExpression", "Identifier"],
      right: "Expression"
    }
  ],
  // Expression - Combination

};
