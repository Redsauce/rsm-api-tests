const { spec } = require("pactum");
const { baseUrl } = require('../../config');
const { expectedJsonGenericSchema } = require("../../schemas/schemas");
const responseMessages = require('../../shared/responseMessages.json');

require("dotenv").config();
const token = process.env.RS_TOKEN;

describe("Get items count", async () => {
  it("Checks a correct get items count with itemTypeID", async () => {
    const body = { itemTypeID: 8 };

    const expectedJsonSchema = {
      type: "object",
      properties: {
        totalItems: { type: "integer" }
      },
      required: ["totalItems"]
    };

    await spec()
      .get(`${baseUrl}/items/getCount.php`)
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
      .get(`${baseUrl}/items/getCount.php`)
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
      .get(`${baseUrl}/items/getCount.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.getItems.mandatoryFields);

  });
  it("Checks error itemTypeID not integer", async () => {
    const body = { itemTypeID: "8" };

    await spec()
      .get(`${baseUrl}/items/getCount.php`)
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
      .get(`${baseUrl}/items/getCount.php`)
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
      .get(`${baseUrl}/items/getCount.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.invalidArray);
  });
});

