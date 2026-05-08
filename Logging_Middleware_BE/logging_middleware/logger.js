const axios = require("axios");
require("dotenv").config();
const apiRoot = process.env.BASE_URL;
const authToken = process.env.ACCESS_TOKEN;
async function Log(stackName, severity, packageName, logMessage) {
  const payload = {
    stack: stackName,
    level: severity,
    package: packageName,
    message: logMessage
  };
  try {
    const result = await axios({
      method: "post",
      url: `${apiRoot}/logs`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`
      }
    });
    return result.data;
  } catch (err) {
    if (err.response) {
      return err.response.data;
    }
    return err.message;
  }
}
module.exports = Log;