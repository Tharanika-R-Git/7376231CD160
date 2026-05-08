const Log = require("./logger");
async function test() {
  const result = await Log(
    "backend",
    "info",
    "handler",
    "Logger initialized successfully"
  );
  console.log(result);
}
test();