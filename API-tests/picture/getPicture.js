const { spec } = require("pactum");
const { baseUrl } = require('../../config');
const { expectedJsonGenericSchema } = require("../../schemas/schemas.js");
const responseMessages = require('../../shared/responseMessages.json');
require("dotenv").config();
const token = process.env.RS_TOKEN;

describe("Get image", async () => {

  // TODO: when enviroment is set, test images
  // it("Checks incorrect adj", async () => {
  //   await spec()
  //     .get(`${baseUrl}/picture/get.php`)
  //     .withAuth("Authorization", token)
  //     .withQueryParams({
  //       'ID': '87',
  //       'propertyID': '886'
  //     })
  //     .expectStatus(200);
  // });

  it("Checks item not exists", async () => {
    await spec()
      .get(`${baseUrl}/picture/get.php`)
      .withHeaders("authorization", token)
      .withQueryParams({
        'ID': '871090909',
        'propertyID': '886'
      })
      .expectStatus(404)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.itemNotExist);
  });

  it("Checks error property is not an image", async () => {
    await spec()
      .get(`${baseUrl}/picture/get.php`)
      .withHeaders("authorization", token)
      .withQueryParams({
        'ID': '87',
        'propertyID': '58'
      })
      .expectStatus(404)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.picture.propNotImage);
  });


  it("Checks error missing ID", async () => {
    await spec()
      .get(`${baseUrl}/picture/get.php`)
      .withHeaders("authorization", token)
      .withQueryParams("propertyID", "888")
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.mandatoryIDqueryParam);
  });
  it("Checks error missing propertyID", async () => {
    await spec()
      .get(`${baseUrl}/picture/get.php`)
      .withHeaders("authorization", token)
      .withQueryParams("ID", "88")
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.picture.incorrectBody.propertyID);
  });
  it("Checks error incorrect w", async () => {
    await spec()
      .get(`${baseUrl}/picture/get.php`)
      .withHeaders("authorization", token)
      .withQueryParams({
        'ID': '88',
        'propertyID': '888',
        'w': '1980S',
      })
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.picture.incorrectBody.w);
  });
  it("Checks error incorrect h", async () => {
    await spec()
      .get(`${baseUrl}/picture/get.php`)
      .withHeaders("authorization", token)
      .withQueryParams({
        'ID': '88',
        'propertyID': '888',
        'h': '1080s',
      })
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.picture.incorrectBody.h);
  });
  it("Checks error incorrect adj", async () => {
    await spec()
      .get(`${baseUrl}/picture/get.php`)
      .withHeaders("authorization", token)
      .withQueryParams({
        'ID': '88',
        'propertyID': '888',
        'adj': 'sw',
      })
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.picture.incorrectBody.adj);
  });
})