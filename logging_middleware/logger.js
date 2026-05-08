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
    
    const response = await fetch(`${apiRoot}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    return data;

  } catch (err) {

    return err.message;
  }
}

module.exports = Log;