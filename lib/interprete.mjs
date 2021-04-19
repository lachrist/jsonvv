
const regexes = {};

export const interprete = (json, shema, callback) => {

  let error = 

  const visitors = {
    __proto__: null,
    Identifier: (data, node) => ({
      const result = visit(data, schema[node.name]);
      if (result.error) {
        return {
          error: [node, result.error]
          value: null
        };
      }
      if (node.name.startsWith("$")) {
        return result;
      }
      return {
        error: null,
        value: callback(result.value)
      };
    }),
    Literal: (data, node) => {
      if (Reflect.getOwnPropertyDescriptor(node, "regex") !== undefined) {
        if (typeof data !== "string") {
          return {
            error: [node],
            value: null
          };
        }
        if (!new RegExp(node.regex.pattern, node.regex.flags).test(data)) {
          return {
            error: [node],
            value: null
          };
        }
        return {
          error: null,
          value: data
        };
      }
      if (data !== node.value) {
        return {
          error: {node},
          value: null
        };
      }
      return {
        error: null,
        value: data
      };
    },
    SequenceExpression: (data, type) => {
      const childeren = [];
      for (let index = 0; index < type.expressions.length; index++) {
        const result = visit(data, type.expressions[index]);
        if (result.error === null) {
          return result;
        }
        childeren.push(result.error);
      }
      return {
        error: {
          node: node,
          childeren: errors
        },
        value: null
      };
    },
    ArrayExpression: (data, type) => {
      if (!Array.isArray(data)) {
        return {
          error: vale,
          value: null
        }
      }
      let index2 = 0;
      for (index1 = 0; index1 < type.data.length; index1++) {
        if (node) {
          
        }
      }
    }
    ObjectExpression: (data, type) => {
      
    }
    
  };
  
};


