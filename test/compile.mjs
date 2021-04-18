
import { strict as Assert } from "assert"; 
import { generate as escodegen } from "escodegen";
import { parse as acorn } from "acorn";
import compile from "../lib/compile.mjs";

const options = {
  ecmaVersion: 2020,
  locations: true
};



const test = (code1, code2) => Assert.equal(
  escodegen(compile(acorn(code1, options))),
  escodegen(acorn(code2, options))
);

Assert.throws(
  () => compile(
    acorn("String = 123;", {ecmaVersion:2020, locations:false})),
  /^SyntaxError: at \?\?\?, duplicate primitive type declaration String$/
);

Assert.throws(
  () => test("Foo = 123; Foo = 123", ""),
  /^SyntaxError: at [^,]*, duplicate type declaration Foo/
);

/////////////////
// Environment //
/////////////////

[
  "Foo = Bar;",
  "Foo = (x < 123, Bar, x > 456);",
  "Foo = [null, Bar, null];",
  "Foo = [null, ~ Bar, null];",
  "Foo = [null, ... Bar, null];",
  "Foo = { a: null, b: Bar, c: null };",
  "Foo = { a: null, b: ~ Bar, c: null };",
  "Foo = { a: null, ... Bar, c: null };",
].forEach((code) => {
  Assert.throws(
    () => test(code, ""),
    /^SyntaxError: at [^,]*, missing type variable Bar$/
  );
});

Assert.throws(
  () => test("$Foo = $Bar; $Bar = $Foo;", ""),
  /^SyntaxError: at [^,]*, cycling macro \$Bar$/
);

test(
  "$Qux = 123; Foo = $Bar; $Bar = $Qux;",
  "Foo = 123;",
);

///////////////////
// Normalization //
///////////////////

test(
  "Foo = (123, (456, 789));",
  "Foo = (123, 456, 789);"
);

test(
  "Foo = {a:123, b:~456, c:~789};",
  `Foo = (
    {a:123},
    {a:123, c:789},
    {a:123, b:456},
    {a:123, b:456, c:789}
  );`,
);

test(
  "Foo = ({a:~String}, x < 123);",
  "Foo = ({}, {a:String}, x < 123);"
);

test(
  "Foo = [~{a:~123}, ...{b:~456}];",
  "Foo = [~({}, {a:123}), ... ({}, {b:456})];"
);

Assert.throws(
  () => test("Foo = { ... ({}, 123) };", null),
  /SyntaxError: at [^,]*, expected an ObjectExpression instead of a Literal/
);

