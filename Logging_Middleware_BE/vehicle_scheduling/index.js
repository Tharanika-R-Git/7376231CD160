const {
  fetchDepots,
  fetchVehicles,
} = require("./api/fetchData");

const maximizeImpact = require(
  "./algorithms/knapsack"
);

const Log = require(
  "../logging_middleware/logger"
);

async function main() {
  try {
    const depots = await fetchDepots();
    const vehicles = await fetchVehicles();

    for (const depot of depots) {
      const maxImpact = maximizeImpact(
        vehicles,
        depot.MechanicHours
      );

      await Log(
        "backend",
        "info",
        "service",
        `Calculated max impact for depot ${depot.ID}`
      );

      console.log({
        depot: depot.ID,
        hours: depot.MechanicHours,
        maxImpact,
      });
    }
  } catch (error) {
    await Log(
      "backend",
      "error",
      "handler",
      error.message
    );
  }
}

main();