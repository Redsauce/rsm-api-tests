const { spec } = require("pactum");
const { baseUrl } = require('../../config');
const { expectedJsonGenericSchema } = require("../../schemas/schemas.js");
const reponseMessages = require('../../shared/reponseMessages.json');
require("dotenv").config();
const token = process.env.RS_TOKEN;

describe("Get AuditTrail", async () => {

  it("Checks a correct get AuditTrail", async () => {

    const body = {
      ID: 139348,
      propertyID: 73
    }

    const expectedCorrectJsonSchema = {
      type: "object",
      properties: {
        propertyType: { type: "string" },
        changes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              userName: { type: "string" },
              description: { type: "string" },
              changedDate: { type: "string" },
              initialValue: { type: "string" },
              finalValue: { type: "string" }
            },
            required: ["userName", "description", "changedDate", "initialValue", "finalValue"]
          }
        }
      },
      required: ["propertyType", "changes"]
    };

    await spec()
      .get(`${baseUrl}/audittrail/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedCorrectJsonSchema);
  });

  it("Checks a correct get AuditTrail - Item does not have audit", async () => {

    const body = {
      ID: 4712,
      propertyID: 821
    }

    await spec()
      .get(`${baseUrl}/audittrail/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.auditTrail.noAuditTrail);
  });

  it("Checks error token has no permissions", async () => {
    const body = {
      ID: 471,
      propertyID: 8
    };

    await spec()
      .get(`${baseUrl}/audittrail/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(403)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.auditTrail.noPermissions);
  });

  it("Checks error request body not json object", async () => {
    const body = [{
      ID: 132,
      propertyID: 821
    }];

    await spec()
      .get(`${baseUrl}/audittrail/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.invalidJsonObject);
  });

  it("Checks error request body not contains propertyID", async () => {
    const body = { ID: 471 };

    await spec()
      .get(`${baseUrl}/audittrail/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.auditTrail.incorrectBody);
  });
});