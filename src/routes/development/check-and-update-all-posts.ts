import {message, messages} from "tdl/types/tdlib";
import {JSJOBS_CHANNEL_ID} from "../../constants";
import {Post} from "../../db";
import {saveMessageToDB} from "../../parser/formatPost";
import {client} from "../../tdlib-connect";

export async function checkAndUpdateAllPosts(req: any, res: any) {
  try {
    await Post.deleteMany({}, (err: any) => {
      if (err) {console.log(err); }
    });

    const lastMessage: messages = await client.invoke({
      _: "getChatHistory",
      chat_id: JSJOBS_CHANNEL_ID,
      from_message_id: 0,
      limit: 1,
      offset: 0,
    });

    const firstMessageId = lastMessage.messages[0].id;

    let count = 0;
    const messagesArray = await getLastMessages(firstMessageId, []);
    console.log(messagesArray && messagesArray.length);
    if (messagesArray) {
      messagesArray.forEach((item: message) => {
        saveMessageToDB(item);
      });
    }

    res.json({
      answer: messagesArray,
    });

    async function delay(ms: number) {
      const timer = (ms: number) => new Promise((res) => setTimeout(res, ms));
      await timer(ms);
    }

    async function getLastMessages(
      lastMessageId: message["id"],
      messagesStack: message[],
    ): Promise<message[]|undefined> {
      await delay(3000);
      const messageArray = [...messagesStack];
      console.log(messageArray.length);
      count++;
      if (count < 30) {
        try {
          const rawMessages = await client.invoke({
            _: "getChatHistory",
            chat_id: JSJOBS_CHANNEL_ID,
            from_message_id: lastMessageId,
            limit: 50,
            offset: 0,
          });

          const newLastMessageId = rawMessages.messages[rawMessages.messages.length - 1].id;
          messageArray.push(...rawMessages.messages);
          return await getLastMessages(newLastMessageId, messageArray);
        } catch (err) {
          console.log(err);
          res.json({
            err,
          });
        }
      } else {
        console.log('I parsed ' + messageArray.length + ' posts!');
        return messageArray;
      }
    }

  } catch (err) {
    res.json({
      err,
    });

    console.log(JSON.stringify(err, null, 2));
  }
}
