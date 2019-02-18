import {JSJOBS_CHANNEL_ID} from "../../constants";
import {Post} from "../../db";
import {saveMessageToDB} from "../../parser/formatPost";
import {client} from "../../tdlib-connect";

export const regeneratePosts = async (req: any, res: any) => {
  try {
    await Post.deleteMany({}, function(err: any) { // remove all posts
      if (err) {
        console.log(err);
      }
    });

    const lastMessage: any = await client.invoke({
      _: "getChatHistory",
      chat_id: JSJOBS_CHANNEL_ID,
      from_message_id: 0,
      offset: 0,
      limit: 1,
      only_local: false,
    });

    const lastMessageId = lastMessage.messages[0].id;

    const lastMessages: any = await client.invoke({
      _: "getChatHistory",
      chat_id: JSJOBS_CHANNEL_ID,
      from_message_id: lastMessageId,
      offset: 0,
      limit: 100,
      only_local: false,
    });

    const allLastMessages = [...lastMessage.messages, ...lastMessages.messages];

    allLastMessages.forEach((message: any) => {
      saveMessageToDB(message);
    });

    res.json({
      answer: allLastMessages,
    });
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
  }
};
