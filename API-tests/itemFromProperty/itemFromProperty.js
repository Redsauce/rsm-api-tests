const { spec } = require("pactum");
const { baseUrl } = require('../../config');
const { expectedJsonGenericSchema } = require("../../schemas/schemas");
const responseMessages = require('../../shared/responseMessages.json');
require("dotenv").config();
const token = process.env.RS_TOKEN;

describe("Get item from property", async () => {
  it("Checks a correct get when it's only 1 item ", async () => {
    const body = {
      itemType: 62,
      filterProperty: 319,
      filterPropertyID: 10
    };

    const expectedJsonSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          propertyID: { type: "string" },
          name: { type: "string" },
          value: { type: "string" },
          type: { type: "string" },
          filename: { type: "string" },
          filesize: { type: "string" },
          trs: { type: "string" },

        },
        required: ["propertyID", "name", "value", "type"]
      }
    };

    await spec()
      .get(`${baseUrl}/items/getItemFromProperty.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonSchema);
  });

  it("Checks a correct get when it's 2 items or more ", async () => {
    const body = {
      itemType: 154,
      filterProperty: 1474,
      filterPropertyID: 14
    };
    const expectedJsonSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          ID: { type: "string" }
        },
        patternProperties: {
          "[A-Za-z]+": { type: "string" }
        },
        required: ["ID"]
      }
    };
    await spec()
      .get(`${baseUrl}/items/getItemFromProperty.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonSchema);

  });
  it("Checks error item does not exist", async () => {
    const body = {
      itemType: 154,
      filterProperty: 1474,
      filterPropertyID: 14090909090
    };
    await spec()
      .get(`${baseUrl}/items/getItemFromProperty.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(404)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.itemNotExist);

  });
  it("Checks error request body is no json object ", async () => {
    const body = `[
            "itemType": 154,
            "filterProperty": 1474,
            "filterPropertyID": 14
          ]`;
    await spec()
      .get(`${baseUrl}/items/getItemFromProperty.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.invalidJsonBody);
  });
  it("Checks error request body does not include necessary params ", async () => {

    const body = {
      itemType: 154,
      filterProperty: 1474,
      itemID: 2
    };
    await spec()
      .get(`${baseUrl}/items/getItemFromProperty.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.itemFromProperty.incorrectBody);
  });
});