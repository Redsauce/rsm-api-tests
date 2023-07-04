const { spec } = require("pactum");
const { expect } = require('chai');
const { baseUrl } = require('../../config');
const { expectedJsonGenericSchema } = require("../../schemas/schemas");
const responseMessages = require('../../shared/responseMessages.json');
const functions = require('../../shared/sharedFunctions');

require("dotenv").config();
const token = process.env.RS_TOKEN;

describe("Update items tests", async () => {
  let itemIDs;
  let originalProperties;

  beforeEach(async () => {
    itemIDs = [await functions.createPersonItem(), await functions.createPersonItem()];
    originalProperties = await functions.getPersonItems([itemIDs[0], itemIDs[1]], [58, 59]);
  });

  it("Checks a correct update with 1 item ", async () => {

    const body = [{
      ID: itemIDs[0],
      58: "newName",
      59: "newSurname",
    }];

    await spec()
      .patch(`${baseUrl}/items/update.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.updateItems.updated);

    const afterUpdateProperties = await functions.getPersonItems([itemIDs[0]], [58, 59]);
    expect(originalProperties[0]).to.not.deep.equal(afterUpdateProperties[0]);
    expect(functions.verifyBodyContent(afterUpdateProperties[0], body[0])).to.be.true;
  });
  it("Checks a correct update with 2 items ", async () => {
    const body = [{
      ID: itemIDs[0],
      58: "newName",
      59: "newSurname",
    }, {
      ID: itemIDs[1],
      58: "newName2",
      59: "newSurname2",
      146: "newName newSurname2",
    }];

    await spec()
      .patch(`${baseUrl}/items/update.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonGenericSchema);

    const afterUpdateProperties = await functions.getPersonItems([itemIDs[0], itemIDs[1]], [58, 59, 146]);
    expect(originalProperties[0]).to.not.deep.equal(afterUpdateProperties[0]);
    expect(originalProperties[1]).to.not.deep.equal(afterUpdateProperties[1]);
    expect(functions.verifyBodyContent(afterUpdateProperties[0], body[0])).to.be.true;
    expect(functions.verifyBodyContent(afterUpdateProperties[1], body[1])).to.be.true;
  });
  it("Checks a correct update with 2 items (1 incongruent) ", async () => {
    const body = [{
      ID: itemIDs[0],
      58: "newName",
      59: "newSurname"
    }, {
      ID: itemIDs[1],
      58: "newName2",
      99: "newSurname2"
    }];

    await spec()
      .patch(`${baseUrl}/items/update.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.updateItems.incongruent);

      const afterProperties = await functions.getPersonItems([itemIDs[0]], [58, 59]);
      expect(originalProperties[0]).to.deep.equal(afterProperties[0]);
  });

  it("Checks error item does not exist", async () => {
    const body = [
      {
        ID: 813090909090,
        58: "newName",
        59: "newSurname",
      }
    ];
    await spec()
      .patch(`${baseUrl}/items/update.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.itemNotExist);

  });
  it("Checks error request must be an array ", async () => {
    const body = `{
      {
          ID:` + itemIDs[0] + `,
          58: "newName",
          59: "newSurname"
      },
      {
      ID:` + itemIDs[1] + ` ,
      58: "newName2",
      59: "newSurname2"
    }
  }`;

    await spec()
      .patch(`${baseUrl}/items/update.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.invalidJsonBody);

    const afterProperties = await functions.getPersonItems([itemIDs[0], itemIDs[1]], [58, 59]);
    expect(originalProperties[0]).to.deep.equal(afterProperties[0]);
    expect(originalProperties[1]).to.deep.equal(afterProperties[1]);
  });
  it("Checks error request must be an array of JSON objects ", async () => {
    const body = [
      {
        ID: itemIDs[0],
        58: "newName",
        59: "newSurname"
      },
      "123",
      123
    ];

    await spec()
      .patch(`${baseUrl}/items/update.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.invalidJsonObject);

      
    const afterProperties = await functions.getPersonItems([itemIDs[0]], [58, 59]);
    expect(originalProperties[0]).to.deep.equal(afterProperties[0]);
  });
  it("Checks error request ID field not integer ", async () => {
    const body = [{
      ID: "998",
      58: "newName",
      59: "newSurname"
    }];

    await spec()
      .patch(`${baseUrl}/items/update.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.updateItems.incorrectBody.integerID);
  });
  it("Checks error request ID field not exists ", async () => {
    const body = [{
      id: itemIDs[0],
      58: "newName",
      59: "newSurname"
    }];

    await spec()
      .patch(`${baseUrl}/items/update.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(responseMessages.updateItems.incorrectBody.id);
  });

  afterEach(async () => {
    await functions.deletePersonItems(itemIDs);
  });
});