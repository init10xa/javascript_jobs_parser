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
    const messagesArray = await getLastMessages(firstMessageId, 0, []);
    if (messagesArray) {
      messagesArray.forEach((item: message) => {
        saveMessageToDB(item);
      });
    }

    res.json({
      answer: messagesArray,
    });

    async function getLastMessages(
      newLastMessageId: message["id"],
      oldLastMessageId: message["id"],
      messagesStack: message[],
    ): Promise<message[]|undefined> {
      const messageArray = [...messagesStack];
      count++;
      if (newLastMessageId !== oldLastMessageId && count < 4) {
        try {
          const rawMessages = await client.invoke({
            _: "getChatHistory",
            chat_id: JSJOBS_CHANNEL_ID,
            from_message_id: newLastMessageId,
            limit: 2,
            offset: 0,
          });

          const savedLastMessageId = newLastMessageId;
          const lastMessageId = rawMessages.messages[rawMessages.messages.length - 1].id;
          messageArray.push(...rawMessages.messages);

          return await getLastMessages(lastMessageId, savedLastMessageId, messageArray);
        } catch (err) {
          console.log(err);
          res.json({
            err,
          });
        }
      } else {
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
