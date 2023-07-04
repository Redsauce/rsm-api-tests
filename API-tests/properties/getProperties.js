const { spec } = require("pactum");
const { baseUrl } = require('../../config');
const { expectedJsonGenericSchema } = require("../../schemas/schemas");
const reponseMessages = require('../../shared/reponseMessages.json');
const functions = require('../../shared/sharedFunctions');

require("dotenv").config();
const token = process.env.RS_TOKEN;

describe("Get properties", async () => {
  let itemID;

  before(async () => {
    itemID = await functions.createPersonItem();
  });

  it("Checks a correct get properties with of 1 item", async () => {
    const body = {
      ID: itemID,
      itemTypeID: 8
    };
    const expectedJsonSchema = {
      type: "object",
      patternProperties: {
        "[A-Za-z]+": {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              id: { type: "string" },
              type: { type: "string" },
              value: { type: "string" },
              realValue: { type: "string" },
            }
          }
        }
      }
    };
    await spec()
      .get(`${baseUrl}/properties/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonSchema);
  });
  it("Checks a correct get item when it doesn't exist", async () => {

    const body = {
      ID: 309090909090,
      itemTypeID: 8
    };
    await spec()
      .get(`${baseUrl}/properties/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(404)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.itemNotExist);
  });

  it("Checks error request must be a JSON object", async () => {
    const body = [{
      ID: itemID,
      itemTypeID: 8
    }];

    await spec()
      .get(`${baseUrl}/properties/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.invalidJsonObject);
  });
  it("Checks error request must contain propertyIDs or itemTypeID", async () => {
    const body = { ID: 3 };
    await spec()
      .get(`${baseUrl}/properties/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.properties.incorrectBody);
  });

  after(async () => {
    await functions.deletePersonItems([itemID]);
  });
});