const { spec } = require("pactum");
const { expect } = require('chai');
const { baseUrl } = require('../../config');
const { expectedJsonErrorMessageSchema, expectedItemTypesJsonSchema } = require("../../schemas/schemas.js");
const errorMessages = require('../../shared/errorResponseMessages.json');

require("dotenv").config();
const token = process.env.RS_TOKEN;

describe("Get item types", async () => {
  it("Checks a correct get all itemtypes", async () => {
    await spec()
      .get(`${baseUrl}/items/getTypes.php`)
      .withHeaders("authorization", token)
      .expectStatus(200)
      .expectJsonSchema(expectedItemTypesJsonSchema);
  });
  it("Cheks a correct get 3 itemtypes", async () => {

    const response = await spec()
      .get(`${baseUrl}/items/getTypes.php`)
      .withHeaders("authorization", token)
      .withQueryParams("ID", "6,7,8")
      .expectStatus(200)
      .expectJsonSchema(expectedItemTypesJsonSchema);

    response.body.forEach(function (item) {
      expect(["6", "7", "8"]).to.include(item.itemTypeID);
    });
  });
  it("Cheks error no itemtypes found", async () => {
    await spec()
      .get(`${baseUrl}/items/getTypes.php`)
      .withHeaders("authorization", token)
      .withQueryParams("ID", "notexistingid")
      .expectStatus(404)
      .expectJsonSchema(expectedJsonErrorMessageSchema)
      .expectBody(errorMessages.itemTypes.notFound);
  });
});