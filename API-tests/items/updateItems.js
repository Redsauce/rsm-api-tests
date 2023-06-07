const { spec } = require("pactum");
const { expect } = require('chai');
const { baseUrl } = require('../../config');
const { expectedJsonErrorMessageSchema } = require("../../schemas/schemas");
const errorMessages = require('../../shared/errorResponseMessages.json');
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
    const expectedJsonSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          itemTypeID: { type: "integer" },
          ID: { type: "integer" },
          58: { type: "string" },
          59: { type: "string" },
        },
        required: ["itemTypeID", "ID", "58", "59"],
      },
    };

    await spec()
      .patch(`${baseUrl}/items/update.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonSchema);

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
    const expectedJsonSchema = {
      type: "array",
      items: [
        {
          type: "object",
          properties: {
            itemTypeID: { type: "integer" },
            ID: { type: "integer" },
            58: { type: "string" },
            59: { type: "string" },
          },
          required: ["itemTypeID", "ID", "58", "59"],
        },
        {
          type: "object",
          properties: {
            itemTypeID: { type: "integer" },
            ID: { type: "integer" },
            58: { type: "string" },
            59: { type: "string" },
            146: { type: "string" },
          },
          required: ["itemTypeID", "ID", "58", "59", "146"],
        },
      ],
    };

    await spec()
      .patch(`${baseUrl}/items/update.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonSchema);

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
    const expectedJsonSchema = {
      type: "array",
      items: [
        {
          type: "object",
          properties: {
            itemTypeID: { type: "integer" },
            ID: { type: "integer" },
            58: { type: "string" },
            59: { type: "string" },
          },
          required: ["itemTypeID", "ID", "58", "59"],
        },
        {
          type: "object",
          properties: {
            ID: { type: "integer" },
            error: { type: "string" },
          },
          required: ["ID", "error"],
        },
      ],
    };

    const response = await spec()
      .patch(`${baseUrl}/items/update.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonSchema);

    const afterUpdateProperties = await functions.getPersonItems([itemIDs[0]], [58, 59]);
    expect(originalProperties[0]).to.not.deep.equal(afterUpdateProperties[0]);
    expect(functions.verifyBodyContent(afterUpdateProperties[0], body[0])).to.be.true;
    expect(response.body[1]['error']).to.eql(errorMessages.updateItems.incongruent);

  });

  it("Checks error item does not exist", async () => {
    const body = [
      {
        ID: 813090909090,
        58: "newName",
        59: "newSurname",
      }
    ];
    const expectedJsonSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          ID: { type: "integer" },
          error: { type: "string" }
        },
        required: ["ID", "error"],
      }
    };

    const response = await spec()
      .patch(`${baseUrl}/items/update.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonSchema);

    expect(response.body[0]['error']).to.eql(errorMessages.updateItems.itemNotExist);

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
      .expectJsonSchema(expectedJsonErrorMessageSchema)
      .expectBody(errorMessages.invalidJsonBody);
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
      .expectJsonSchema(expectedJsonErrorMessageSchema)
      .expectBody(errorMessages.invalidJsonObject);
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
      .expectJsonSchema(expectedJsonErrorMessageSchema)
      .expectBody(errorMessages.updateItems.incorrectBody.integerID);
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
      .expectJsonSchema(expectedJsonErrorMessageSchema)
      .expectBody(errorMessages.updateItems.incorrectBody.id);
  });

  afterEach(async () => {
    await functions.deletePersonItems(itemIDs);
  });
});