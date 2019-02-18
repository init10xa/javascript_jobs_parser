import {message, messages} from "tdl/types/tdlib";
import {JSJOBS_CHANNEL_ID} from "../../constants";
import {Post} from "../../db";
import {saveMessageToDB} from "../../parser/formatPost";
import {client} from "../../tdlib-connect";

export async function checkAndUpdateAllPosts(req: any, res: any) {
  try {
    await Post.deleteMany({}, (err: any) => {
      if (err) {console.log(err);}
    });

    const lastMessage: messages = await client.invoke({
      _: "getChatHistory",
      chat_id: JSJOBS_CHANNEL_ID,
      from_message_id: 0,
      offset: 0,
      limit: 1,
    });

    const lastMessageId = lastMessage.messages[0].id;

    let count = 0;
    const messages = await getLastMessages(lastMessageId, 0, []);
    if (messages) {
      messages.forEach((item: message) => {
        saveMessageToDB(item);
      });
    }

    res.json({
      answer: messages,
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
          const messages = await client.invoke({
            _: "getChatHistory",
            chat_id: JSJOBS_CHANNEL_ID,
            from_message_id: newLastMessageId,
            offset: 0,
            limit: 2,
          });

          const savedLastMessageId = newLastMessageId;
          const lastMessageId = messages.messages[messages.messages.length - 1].id;
          messageArray.push(...messages.messages);

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
