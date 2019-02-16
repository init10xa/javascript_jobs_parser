import {API_HASH, API_ID} from "./constants";
import {Client} from "tdl";

const API_ID_DEFINED = API_ID ? API_ID : '2222'; // Hack TS "probably undefined"

export const client = new Client({
  apiId: +API_ID_DEFINED, // Your api_id
  apiHash: API_HASH, // Your api_hash
});

client.connect();

// const login = await client.login(()=> ({
//   phoneNumber: ''
// }));
