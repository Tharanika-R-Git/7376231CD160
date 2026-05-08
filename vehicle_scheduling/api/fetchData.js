const axios = require("axios");
require("dotenv").config();
const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.ACCESS_TOKEN;
const headers = {
  Authorization: `Bearer ${TOKEN}`,
};
async function fetchDepots() {
  const response = await axios.get(
    `${BASE_URL}/depots`,
    { headers }
  );
  return response.data.depots;
}
async function fetchVehicles() {
  const response = await axios.get(
    `${BASE_URL}/vehicles`,
    { headers }
  );
  return response.data.vehicles;
}
module.exports = {
  fetchDepots,
  fetchVehicles,
};