
{
  const minimist = require("minimist");
  const argv = minimist(process.argv.slice(2));
  const indent = parseInt(argv.indent);
  const depth = 0
  const size = 0;
  const buildBinaryExpression = (location, operator, expression1, expression2) => ({
    type: "BinaryOperator",
    location,
    operator,
    left: expression1,
    right: expression2
  });
  const buildMetaProperty = (location, name1, name2) => ({
    type: "MetaProperty",
    location,
    meta: {
      type: "Identifier",
      name: name1
    },
    property: {
      type: "Identifier",
      name: name2
    }
  });
  const buildBigIntLiteral = (location, value) => ({
    type: "Literal",
    location,
    value: value,
    raw: `${value.toString()}n`,
    bigint: value.toString(),
  });
  const buildLiteral = (location, value, raw) => ({
    type: "Literal",
    location,
    raw,
    value,
  });
  const buildRegExpLiteral = (location, pattern, flags) => ({
    type: "Literal",
    location,
    raw: `/${pattern}/${flags}`,
    value: new RegExp(pattern, flags),
    regex: {
      pattern,
      flags,
    },
  });
}

_ = " " | " /* "


__ = [^0-9$_a-zA-Z];

Identifier = start:[$_a-zA-Z] parts:[0-9$_a-zA-Z]* { return start + parts.join(""); }

Indent = "\n" spaces:" "+ {
  if (spaces.length !== depth * size) {
    return expected(`An indentation of ${depth * size} spaces, got: ${spaces.length}`);
  }
  return undefined;
}

AtomicExpression
  = "true" __ { return buildLiteral(true) }
  | "false" __ { return buildLiteral(false) }
  | "null" __ { return buildLiteral(null) }
  | "-" "0"+ { return  }
  | sign:?"-" base:[0-9]+ "n" { return buildBigIntLiteral(base); }
  | base:[0-9]+ "e" exponent:[0-9]+ { return buildBigIntLiteral(parseInt(base)**parseInt(exponent), text)  }
  | [0-9]+ { return parseInt(text) }
  | [0-9]+ "." [0-9]+ { return buildLiteral(parseFloat(text), test)  }
  | n:Identifier { return buildIdentifier(n) }
  | "new.target" __ { return buildMetaProperty("new", "target") }
  | "import.meta" __ { return buildMetaProperty("import", "meta") }

foo(
  1,
  2,
  3
)(
  4,
  5,
  6
)
  

Expression
  = e:AtomicExpression { return e }
  | o:UnaryOperator e:Expression { return buildUnaryExpression(o, e) }
  | e: InlineExpression
  | "(" { depth += 1 } e:CompoundBodyExpression { depth -= 1 } Indent ")" { return e }
  | "{" { depth += 1 } ps:Properties { depth -= 1 } Indent "}" { return buildObjectExpression(ps) }
  | "[" { depth += 1 } es:SpreadableExpressionComa* { depth -= 1 } Indent "}" { return buildArrayExpression(es) }

InlineExpression
  = e:AtomicExpression { return e }
  | o:UnaryOperator e:InlineExpression { return buildUnaryExpression(o, e) }
  | e1:AtomicExpression " " o:BinaryOperator " " e2:AtomicExpression { return buildBinaryExpression(o, e1, e2) }
  | e:AtomicExpression

InlineArgumentList =
  | "()" { return [] }
  | "(" e:InlineSpreadableExpression es:InlineComaSpreadableExpression* ")" { return [e].concat(es) }

SpreadableInlineExpression
  = "..." e:InlineExpression { return buildSpreadElement(e) }
  | e:InlineExpression { return e }

ComaSpreadableInlineExpression
  = ", " e:SpreadableInlineExpression { return e }



CompoundExpression
  
SpreadableExpression
  = "..." e:Expression { return buildSpreadElement(e) }
  | e:Expression { return e }

CompoundBodyExpression
  = Indent e1:Expression " " o:BinaryOperator Indent e2:Expression { return buildBinaryExpression(o, e1, e2) }
  | Indent e1:Expression " ?" Indent e2:Expression " :" Indent e3:Expression { return builConditionalExpression(e1, e2, e3) }
  | Indent e:Expression " (" es:IndentSpreadableExpressionComa* ")" { return buildCallExpression(e, es) }
  | 

IndentSpreadableExpressionComa = Indent e:SpreadableExpression "," { return e } 
