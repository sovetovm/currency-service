import { updateCurrencyRates } from "./src/updateCurrencyRates";

updateCurrencyRates()
  .then(() => {
    console.log("Currency rates updated successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error updating currency rates:", error);
    process.exit(1);
  });
