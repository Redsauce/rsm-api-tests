const { spec } = require("pactum");
const { expect } = require('chai');
const { baseUrl } = require('../../config');
const { expectedJsonGenericSchema } = require("../../schemas/schemas");
const reponseMessages = require('../../shared/reponseMessages.json');
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

    await spec()
      .delete(`${baseUrl}/items/delete.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.deleteItems.deleted);

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

    await spec()
      .delete(`${baseUrl}/items/delete.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.deleteItems.notDeleted);

    expect(await functions.verifyItemExists(itemIDs[0], 8)).to.eql(200);
    expect(await functions.verifyItemExists(itemIDs[1], 8)).to.eql(200);
  });

  it("Checks an incorrect delete when item does not exist", async () => {
    const body = [{
      itemTypeID: 8,
      IDs: [7800909090909],
    }];

    await spec()
      .delete(`${baseUrl}/items/delete.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.itemNotExist)
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
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.invalidArray);

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
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.invalidArray);

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
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.invalidJsonObject);

    itemsToDelete.push(itemID);
  });
  after(async () => {
    await functions.deletePersonItems(itemsToDelete);
  });
});