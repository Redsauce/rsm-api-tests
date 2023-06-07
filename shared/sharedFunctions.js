const { spec } = require("pactum");
require("dotenv").config();
const { baseUrl } = require('../config');
const token = process.env.RS_TOKEN;

async function createPersonItem() {
  const body = [{
    58: "Name",
    59: "Surname",
  }];

  const response = await spec()
    .post(`${baseUrl}/items/create.php`)
    .withHeaders("authorization", token)
    .withBody(body)
    .expectStatus(200);

  return response.body[0].ID;
}
// ids and properties should be passed as arrays
async function getPersonItems(ids, properties) {
  const body = {
    IDs: ids,
    itemTypeID: 8,
    propertyIDs: properties
  };

  const response = await spec()
    .get(`${baseUrl}/items/get.php`)
    .withHeaders("authorization", token)
    .withBody(body)
    .expectStatus(200);

  return response.body;
}

// itemIds shoud be an array
async function deletePersonItems(itemIDs) {
  const body = [{
    itemTypeID: 8,
    IDs: itemIDs
  }];

  await spec()
    .delete(`${baseUrl}/items/delete.php`)
    .withHeaders("authorization", token)
    .withBody(body)
    .expectStatus(200);
}

async function verifyItemExists(id, itemType) {
  const body = {
    IDs: [id],
    itemTypeID: itemType,
  };

  const response = await spec()
    .get(`${baseUrl}/items/get.php`)
    .withHeaders("authorization", token)
    .withBody(body);

  return response.statusCode;
}

function verifyBodyContent(newBody, expectedValues) {
  for (const [key, value] of Object.entries(expectedValues)) {
    // Validate if key exists in the new body and validate its value
    if (!(key in newBody) || newBody[key].toString() !== value.toString()) {
      return false;
    }
  }
  return true;
}

module.exports = {
  createPersonItem,
  getPersonItems,
  deletePersonItems,
  verifyItemExists,
  verifyBodyContent
}