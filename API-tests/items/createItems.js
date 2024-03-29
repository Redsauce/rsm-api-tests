const { spec } = require("pactum");
const { expect } = require('chai');
const { baseUrl } = require('../../config');
const { expectedJsonGenericSchema, expectedCreateItemJsonSchema } = require("../../schemas/schemas");
const responseMessages = require('../../shared/responseMessages.json');
const functions = require('../../shared/sharedFunctions');

require("dotenv").config();
const token = process.env.RS_TOKEN;

let itemsToDelete = [];

describe("Create items", async () => {
  it("Checks a correct create with 1 item ", async () => {
    const body = [{
      58: "Name",
      59: "Surname"
    }];

    const response = await spec()
      .post(`${baseUrl}/items/create.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedCreateItemJsonSchema);

    const itemDetail = (await functions.getPersonItems([response.body[0].ID], [58, 59]))[0];
    expect(itemDetail['58']).to.eql(body[0]['58']);
    expect(itemDetail['59']).to.eql(body[0]['59']);
    expect(await functions.verifyItemExists(response.body[0]['ID'], 8)).to.eql(200);

    itemsToDelete.push(response.body[0].ID);

  });
  it("Checks a correct create 2 items", async () => {
    const body = [{
      58: "Name1",
      59: "Surname1"
    }, {
      58: "Name2",
      59: "Surname2"
    }];

    const response = await spec()
      .post(`${baseUrl}/items/create.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedCreateItemJsonSchema);

    const itemsDetail = await functions.getPersonItems([response.body[0].ID, response.body[1].ID], [58, 59]);

    itemsDetail.forEach((item, index) => {
      expect(item['58']).to.eql(body[index]['58']);
      expect(item['59']).to.eql(body[index]['59']);
    });

    expect(await functions.verifyItemExists(response.body[0]['ID'], 8)).to.eql(200);
    expect(await functions.verifyItemExists(response.body[1]['ID'], 8)).to.eql(200);

    itemsToDelete.push(response.body[0].ID, response.body[1].ID);

  });
  it("Checks an incorrect create with 2 items, 1 with no permissions", async () => {
    const body = [{
      58: "Name",
      59: "Surname",
    }, {
      319: "436"
    }];

    await spec()
      .post(`${baseUrl}/items/create.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.createItemsNoPermissions);
  });

  it("Checks an incorrect create without an array in body ", async () => {
    const body = {
      58: "Name",
      59: "Surname",
    };

    await spec()
      .post(`${baseUrl}/items/create.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.invalidArray);
  });
  it("Checks an incorrect create without an object inside the body array ", async () => {
    const body = [{
      58: "Name",
      59: "Surname",
    },
      "123",
    ];

    await spec()
      .post(`${baseUrl}/items/create.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.invalidJsonObject);
  });

  after(async () => {
    await functions.deletePersonItems(itemsToDelete);
  });
});