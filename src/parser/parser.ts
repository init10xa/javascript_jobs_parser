import {saveMessageToDB} from "../db";
import {JSJOBS_CHANNEL_ID} from "../constants";
import {client} from "../tdlib-connect";

export function parser() {
  main();

  async function main() {
    try {
      client
        .on('update', (update: any) => {
          if (update._ === 'updateNewMessage' && update.message.chat_id === JSJOBS_CHANNEL_ID) {
            const message = update.message;
            if (message && message.content && message.content.text && message.content.text.text) {
              saveMessageToDB(update.message);
            }
          }
        })
        .on('error', (err: any) => {
          console.error('Got error:', JSON.stringify(err, null, 2))
        })
        .on('destroy', () => {
          console.log('destroy event')
        });
    } catch (err) {
      console.log(err)
    }
  }
}
