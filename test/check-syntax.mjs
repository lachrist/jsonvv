import { strict as Assert } from "assert";
import { parse as acorn } from "acorn";
import checkSyntax from "../lib/check-syntax.mjs";

const options = {
  sourceType: "script",
  ecmaVersion: 2020,
  locations: true
};

const test = (code) => {
  const node = acorn(code, options);
  try {
    checkSyntax(node);
    throw Assert.fail("Missing error");
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }
    console.log(error.message);
  }
};

test(`123;`);
test(`Foo += 123;`);
test(`[x] = 123;`);
test(`Foo = 123 ? 456 : 789;`);