const { spec } = require("pactum");
const { baseUrl } = require('../../config');
const { expect } = require('chai');
const { expectedJsonGenericSchema, expectedGetItemsJsonSchema } = require("../../schemas/schemas");
const responseMessages = require('../../shared/responseMessages.json');
const functions = require('../../shared/sharedFunctions');

require("dotenv").config();
const token = process.env.RS_TOKEN;

describe("Get items", async () => {
  let itemIDs;

  before(async () => {
    itemIDs = [await functions.createPersonItem(), await functions.createPersonItem()];
  });
  it("Checks a correct get with 1 item - IDs and itemTypeID", async () => {

    const body = {
      IDs: [itemIDs[0]],
      itemTypeID: 8,
    };

    const response = await spec()
      .get(`${baseUrl}/items/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedGetItemsJsonSchema);

    expect(response.body[0].ID).to.equal(itemIDs[0].toString());
  });

  it("Checks a correct get with 2 item - IDs and propertyIDs", async () => {

    const body = {
      IDs: [itemIDs[0], itemIDs[1]],
      propertyIDs: [58, 59],
    };
    const expectedJsonSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          ID: { "type": "string" },
          58: { "type": "string" },
          59: { "type": "string" }
        },
        required: ["ID", "58", "59"],
      }
    };

    const response = await spec()
      .get(`${baseUrl}/items/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonSchema);

    expect(response.body[0].ID).to.equal(itemIDs[0].toString());
    expect(response.body[1].ID).to.equal(itemIDs[1].toString());

  });

  it("Checks a correct get with all item - itemTypeID", async () => {
    const body = { itemTypeID: 8 };

    await spec()
      .get(`${baseUrl}/items/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedGetItemsJsonSchema);

  });
  it("Checks a correct get with all item - propertyIDs", async () => {
    const body = { propertyIDs: [58] };
    const expectedJsonSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          "58": { type: "string" },
          ID: { type: "string" }
        },
        required: ["ID", "58"]
      }
    };
    await spec()
      .get(`${baseUrl}/items/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonSchema);

  });
  it("Checks a correct get with all item - propertyIDs and filterRules", async () => {
    const body = {
      propertyIDs: [58, 59],
      filterRules: [
        {
          propertyID: 58,
          value: "Sergio",
          operation: "=",
        },
      ],
    };
    const expectedJsonSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          "58": { type: "string" },
          "59": { type: "string" },
          ID: { type: "string" }
        },
        required: ["ID", "58", "59"]
      }
    };

    await spec()
      .get(`${baseUrl}/items/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonSchema);
  });
  it("Checks a correct get with all item - propertyIDs and 2 filterRules", async () => {
    const body = {
      itemTypeID: 8,
      filterRules: [
        {
          propertyID: 58,
          value: "Sergio",
          operation: "=",
        },
        {
          propertyID: 59,
          value: "Miguel Martos",
          operation: "<>",
        },
      ],
    };
    await spec()
      .get(`${baseUrl}/items/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedGetItemsJsonSchema);
  });

  it("Checks a correct get with all item - propertyIDs and extFilterRules", async () => {

    const body = {
      propertyIDs: [146],
      translateIDs: true,
      extFilterRules: [
        {
          propertyID: 58,
          value: "Alejandro",
          operation: "="
        }
      ]
    };

    const expectedJsonSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          ID: { type: "string" },
          "146": { type: "string" }
        },
        required: ["ID", "146"]
      }
    };

    await spec()
      .get(`${baseUrl}/items/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonSchema);
  });
  it("Checks a correct get with all item - propertyIDs, 3 filterRules and extFilterRules", async () => {
    const body = {
      propertyIDs: [320, 326, 325],
      filterRules: [
        {
          propertyID: 321,
          value: "2022-11-01",
          operation: "SAME_OR_AFTER",
        },
        {
          propertyID: 321,
          value: "2022-11-30",
          operation: "SAME_OR_BEFORE",
        },
        {
          propertyID: 326,
          value: 500,
          operation: ">",
        },
      ],
      extFilterRules: [
        {
          propertyID: 493,
          value: "B62752845",
          operation: "=",
        },
      ],
    };
    const expectedJsonSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          "320": { type: "string" },
          "325": { type: "string" },
          "326": { type: "string" },
          ID: { type: "string" }
        },
        required: ["ID", "320", "326", "325"]
      }
    };

    await spec()
      .get(`${baseUrl}/items/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonSchema);
  });

  it("Checks a correct get with 1 item - IDs and itemTypeID With categories", async () => {
    const body = {
      propertyIDs: [58, 59],
      filterRules: [
        {
          propertyID: 58,
          value: "Sergio",
          operation: "=",
        },
      ],
      includeCategories: true
    };
    const expectedJsonSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          ID: { type: "string" },
          General: {
            type: "object",
            properties: {
              "58": { type: "string" },
              "59": { type: "string" }
            },
            required: ["58", "59"]
          }
        },
        required: ["ID", "General"]
      }
    };
    await spec()
      .get(`${baseUrl}/items/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonSchema);
  });
  it("Checks error request must be a JSON object", async () => {
    const body = `[
      propertyIDs: [320,326,325]
    ]`;

    await spec()
      .get(`${baseUrl}/items/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.invalidJsonBody);
  });
  it("Checks error request must contain propertyIDs or itemTypeID", async () => {
    const body = `{
      "propertyIds": [320,326,325]
    }`;

    await spec()
      .get(`${baseUrl}/items/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.getItems.mandatoryFields);

  });
  it("Checks error request itemTypeID is not an integer", async () => {
    const body = {
      itemTypeID: "8",
    };

    await spec()
      .get(`${baseUrl}/items/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.getItems.notInteger);
  });
  it("Checks error request propertyIDs should be an array", async () => {
    const body = {
      propertyIDs: 58,
    };

    await spec()
      .get(`${baseUrl}/items/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.invalidArray);
  });
  it("Checks error request IDs should be an array", async () => {
    const body = {
      IDs: 571,
      itemTypeID: 8
    };

    await spec()
      .get(`${baseUrl}/items/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.invalidArray);
  });
  after(async () => {
    await functions.deletePersonItems(itemIDs);
  });
});