const expectedJsonGenericSchema = {
  type: "object",
  properties: {
    message: {
      type: "string",
    },
  },
  required: ["message"],
};

const expectedUserJsonSchema = {
  type: "object",
  properties: {
    ID: {
      type: "string",
      pattern: "^[0-9]+$"
    }
  },
  required: ["ID"]
}

const expectedItemTypesJsonSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      itemTypeID: { type: "string" },
      name: { type: "string" },
      properties: {
        type: "object",
        patternProperties: {
          "^[0-9]+$": { type: "string" }
        }
      }
    },
    required: ["itemTypeID", "name"]
  }
}

const expectedCreateItemJsonSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      58: { type: "string" },
      59: { type: "string" },
      ID: { type: "integer" },
    },
    required: ["ID", "58", "59"],
  }
}

const expectedGetItemsJsonSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      ID: { type: "string" }
    },
    patternProperties: {
      "^[0-9]+$": { type: "string" }
    },
    required: ["ID"]
  }
};

module.exports = {
  expectedJsonGenericSchema,
  expectedUserJsonSchema,
  expectedItemTypesJsonSchema,
  expectedCreateItemJsonSchema,
  expectedGetItemsJsonSchema
};
