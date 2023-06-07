const { spec } = require("pactum");
const { expect } = require('chai');
const { baseUrl } = require('../../config');
const { expectedJsonErrorMessageSchema } = require("../../schemas/schemas");
const errorMessages = require('../../shared/errorResponseMessages.json');
const functions = require('../../shared/sharedFunctions');

require("dotenv").config();
const token = process.env.RS_TOKEN;

let itemsToDelete = [];

describe("Delete items", async () => {
  it("Checks a correct delete with 1 item", async () => {
    const itemID = await functions.createPersonItem();

    const body = [{
      itemTypeID: 8,
      IDs: [itemID]
    }];

    const expectedJsonSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          itemTypeID: { type: "integer" },
          itemID: { type: "string" },
        },
        required: ["itemTypeID", itemID],
      },
    };

    await spec()
      .delete(`${baseUrl}/items/delete.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonSchema);

    expect(await functions.verifyItemExists(itemID, 8)).to.eql(404);
  });
  it("Checks a correct delete three items with different typeid (1 no permissions)", async () => {

    const itemIDs = [await functions.createPersonItem(), await functions.createPersonItem()];

    const body = [{
      itemTypeID: 8,
      IDs: [itemIDs[0], itemIDs[1]]
    }, {
      itemTypeID: 64,
      IDs: [846],
    }];

    const expectedJsonSchema = {
      type: "array",
      items: [
        {
          type: "object",
          properties: {
            [itemIDs[0]]: { type: "string" },
            [itemIDs[1]]: { type: "string" },
            itemTypeID: { type: "integer" }
          },
          required: ["itemTypeID", itemIDs[0], itemIDs[1]],
        },
        {
          type: "object",
          properties: {
            846: { type: "string" },
            itemTypeID: { type: "integer" }
          },
          required: ["itemTypeID", "846"],
        },
      ],
    };
    const response = await spec()
      .delete(`${baseUrl}/items/delete.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonSchema);

    expect(await functions.verifyItemExists(itemIDs[0], 8)).to.eql(404);
    expect(await functions.verifyItemExists(itemIDs[1], 8)).to.eql(404);
    expect(response.body[1]['846']).to.eql(errorMessages.deleteItems.nok);
  });

  it("Checks an incorrect delete when item does not exist", async () => {
    const body = [{
      itemTypeID: 8,
      IDs: [7800909090909],
    }];

    const expectedJsonSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          itemTypeID: { type: "integer" },
          7800909090909: { type: "string" },
        },
        required: ["itemTypeID", "7800909090909"],
      },
    };

    const response = await spec()
      .delete(`${baseUrl}/items/delete.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonSchema);

    expect(response.body[0]['7800909090909']).to.eql(errorMessages.deleteItems.itemNotExist);
  });
  it("Checks an incorrect delete when body is not array", async () => {

    const itemID = await functions.createPersonItem();
    const body = {
      itemTypeID: 8,
      IDs: [itemID],
    };

    await spec()
      .delete(`${baseUrl}/items/delete.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonErrorMessageSchema)
      .expectBody(errorMessages.invalidArray);

    itemsToDelete.push(itemID);
  });
  it("Checks an incorrect delete when IDs is not an array", async () => {
    const itemID = await functions.createPersonItem();

    const body = [{
      itemTypeID: 8,
      IDs: itemID
    }];

    await spec()
      .delete(`${baseUrl}/items/delete.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonErrorMessageSchema)
      .expectBody(errorMessages.invalidArray);

    itemsToDelete.push(itemID);

  });
  it("Checks an incorrect delete when body is not an array of objects", async () => {
    const itemID = await functions.createPersonItem();

    const body = [{
      itemTypeID: 8,
      IDs: [itemID],
    },
      "123",
      123,
    ];
    await spec()
      .delete(`${baseUrl}/items/delete.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonErrorMessageSchema)
      .expectBody(errorMessages.invalidJsonObject);

    itemsToDelete.push(itemID);
  });
  after(async () => {
    await functions.deletePersonItems(itemsToDelete);
  });
});