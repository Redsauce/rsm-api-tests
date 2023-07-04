const { spec } = require("pactum");
const { baseUrl } = require('../../config');
const { expectedJsonGenericSchema, expectedUserJsonSchema } = require("../../schemas/schemas.js");
const reponseMessages = require('../../shared/reponseMessages.json');
require("dotenv").config();

const token = process.env.RS_TOKEN;
const user = process.env.USER_EMAIL;
const password = process.env.USER_PASSWORD;
const clientID = process.env.CLIENT_ID;

describe("Get UserID", async () => {
  it("Checks a correct get UserID", async () => {
    const body = {
      login: user,
      password: password,
      clientID: clientID
    };
    await spec()
      .get(`${baseUrl}/user/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(200)
      .expectJsonSchema(expectedUserJsonSchema);
  });

  it("Checks error user not found", async () => {
    const body = {
      login: "invented@email.com",
      password: password,
      clientID: clientID
    };

    await spec()
      .get(`${baseUrl}/user/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(404)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.users.notFound);
  });

  it("Checks error body not json object", async () => {
    const body = [{
      login: user,
      password: password,
      clientID: clientID
    }];

    await spec()
      .get(`${baseUrl}/user/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.invalidJsonObject);
  });

  it("Checks error body no login", async () => {
    const body = {
      password: password,
      clientID: clientID
    };

    await spec()
      .get(`${baseUrl}/user/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.users.noLogin);
  });
  it("Checks error body no password", async () => {
    const body = {
      login: user,
      clientID: clientID
    };

    await spec()
      .get(`${baseUrl}/user/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.users.noPassword);
  });

  it("Checks error body no client id", async () => {
    const body = {
      login: user,
      password: password
    };

    await spec()
      .get(`${baseUrl}/user/get.php`)
      .withHeaders("authorization", token)
      .withBody(body)
      .expectStatus(400)
      .expectJsonSchema(expectedJsonGenericSchema)
      .expectBody(reponseMessages.users.noClientId);
  });
});