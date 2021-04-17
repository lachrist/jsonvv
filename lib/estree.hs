
data Identifier = Identifier {
  name :: Identifier
}

data TemplateElement = TemplateElement {
  template_element_raw :: String,
  template_element_cooked :: String
}

data Regex = Regex {
  pattern ::  String,
  flags :: String
}

data SpreadElement = SpreadElement {
  expression :: Expression
}

data Key =
  Literal {
    value :: String
  } |
  Identifier {
    name :: String
  }

data Property = Property Either {
  kind :: String,
  method :: True,
  computed :: True,
  key :: Key
  value :: FunctionExpression
}

data Expression =
  -- Literal --
  Literal {
    value :: Primitive,
    bigint :: Maybe String,
    regex :: Maybe Regex
  } |
  TemplateExpression {
    expressions :: [Expression],
    quasis :: [TemplateElement]
  } |
  FunctionExpression {
    id :: Maybe Identifier,
    async :: Bool,
    generator :: Bool,
    params :: [Pattern],
    body :: BlockStatement
  } |
  ArrowFunctionExpression {
    async :: Boolean,
    expression :: Boolean,
    params :: [Pattern],
    body :: Either Expression BlockStatement
  } |
  ArrayExpression {
    elements :: [Maybe (Either SpreadElement Expression)]
  } |
  Object {
    properties :: [Either SpreadElement Property]
  } |
  -- Environment --
  Super |
  ThisExpression |
  Identifier {
    name :: String
  } |
  AssignmentExpression {
    operator :: AssignmentOperator,
    left :: Pattern
    right :: Expression
  } |
  UpdateExpression {
    operator :: UpdateOperator,
    argument :: Either Identifier MemberExpression
  } |
}
  -- 
}
  
}  
}
  
}