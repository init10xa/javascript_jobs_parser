import {Client} from "tdl";
import {API_HASH, API_ID} from "./constants";

if (!API_ID) {
  throw new Error("API_HASH is not defined");
}

export const client = new Client({
  apiHash: API_HASH, // Your api_hash
  apiId: +API_ID, // Your api_id
});

client.connect();

// const login = await client.login(()=> ({
//   phoneNumber: ''
// }));
