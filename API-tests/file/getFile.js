const { spec } = require("pactum");
const { baseUrl } = require('../../config');

const { expectedJsonErrorMessageSchema } = require("../../schemas/schemas.js");
const errorMessages = require('../../shared/errorResponseMessages.json');
require("dotenv").config();
const token = process.env.RS_TOKEN;

describe("Get File", async () => {

  // TODO: when enviroment is set, test files!
  // it("Checks a correct get File", async () => {

  //     await spec()
  //         .get(`${baseUrl}/file/get.php`)
  //         .withAuth("Authorization", token)
  //         .withQueryParams({
  //             'ID': '125955090909090909',
  //             'propertyID': '631'})
  //         .expectStatus(200)
  // });
  it("Checks error file does not exist", async () => {
    await spec()
      .get(`${baseUrl}/file/get.php`)
      .withHeaders("authorization", token)
      .withQueryParams({
        'ID': '125955090909090909',
        'propertyID': '631'
      })
      .expectStatus(200);
  });

  it("Checks error asked property is not a file ", async () => {
    await spec()
      .get(`${baseUrl}/file/get.php`)
      .withHeaders("authorization", token)
      .withQueryParams({
        'ID': '125955',
        'propertyID': '58'
      })
      .expectStatus(404)
      .expectJsonSchema(expectedJsonErrorMessageSchema)
      .expectBody(errorMessages.file.propNotFile);
  });

  it("Checks error request params should be ID and propertyID", async () => {
    await spec()
      .get(`${baseUrl}/file/get.php`)
      .withHeaders("authorization", token)
      .withQueryParams({
        'itemID': '125955',
        'propertyID': '631'
      })
      .expectStatus(400)
      .expectJsonSchema(expectedJsonErrorMessageSchema)
      .expectBody(errorMessages.mandatoryIDqueryParam);
  });
});