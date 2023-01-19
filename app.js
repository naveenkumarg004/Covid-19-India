const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "covid19India.db");
let db = null;
const startServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running Successfully");
    });
  } catch (e) {
    console.log(`DB Error : ${e.message}`);
    process.exit(1);
  }
};
startServer();
//GET stated API 1
app.get("/states/", async (request, response) => {
  const getStatesQuery = `
    select *
    from state
    `;
  const statesArray = await db.all(getStatesQuery);
  response.send(statesArray);
});

//GET state by ID API 2
app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.params;
  const getStateQuery = `
    select *
    from state
    where state_id = ${stateId}`;
  state = await db.get(getStateQuery);
  response.send(state);
});

//POST API 3
app.post("/districts/", async (request, response) => {
  const districtDetails = request.body;
  const {
    districtName,
    stateId,
    cases,
    cured,
    active,
    deaths,
  } = districtDetails;
  const addDistrictQuery = `
    insert into
    district (district_name , state_id , cases, cured , active , deaths)
    values(
        ${districtName} ,
        ${stateId} ,
        ${cases} ,
        ${cured} ,
        ${active} ,
        ${deaths}
    )`;
  const addDistrictResponse = await db.run(addDistrictQuery);
  const districtId = addDistrictResponse.lastID;
  response.send({ districtId: districtId });
});

//GET Districts with IDs API 4
app.get("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const getDistrictByID = `
    select *
    from district
    where district_id = ${districtId}`;
  const districtDetail = await db.get(getDistrictByID);
  response.send(districtDetail);
});

//DELETE district API 5

app.delete("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const delDistrictQuery = `
    delete from district
    where district_id = ${districtId}`;
  await db.run(delDistrictQuery);
  response.send("District Removed");
});

//PUT update API 6
app.put("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const districtDetails = request.body;
  const {
    districtName,
    stateId,
    cases,
    cured,
    active,
    deaths,
  } = districtDetails;
  const updateDistrictQuery = `
    update district
    set 
    district_name = ${districtName} ,
    state_id = ${stateId} ,
    cases = ${cases} ,
    cured = ${cured} ,
    active = ${active} ,
    deaths = ${deaths}
    where district_id = ${districtId}
    `;
  await db.run(updateDistrictQuery);
  response.send("District Details Updated");
});

//GET status API 7
app.get("/states/:stateId/stats/", async (request, response) => {
  const { stateId } = request.params;
  const getStatsQuery = `
    select *
    from state
    where state_id = ${stateId}`;
  const statsResponse = await db.get(getStatsQuery);
  response.send(statsResponse);
});
//GET state detail API 8
app.get("/districts/:districtId/details/", async (request, response) => {
  const { districtId } = request.params;
  const getDistQuery = `
    select *
    from district
    where district_id = ${districtId}`;

  const distResponse = await db.get(getDistQuery);
  response.send(distResponse);
});

module.exports = app;
