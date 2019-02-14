import {Post} from "../db";
import {API_HASH, API_ID, JSJOBS_CHANNEL_ID, postTypes} from "../constants";
import {Client} from 'tdl';
import uuidv from 'uuid/v4';


export function parser() {
  main();

  async function main() {

    try {
      const client = new Client({
        apiId: API_ID, // Your api_id
        apiHash: API_HASH, // Your api_hash
      });

      await client.connect();
      // const login = await client.login(()=> ({
      //   phoneNumber: '+79634802365'
      // }));

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


      function formatMessageToMongoModel(message: any) {
        const text = message.content.text.text;

        const tags = findHashtags(text);
        const postType = tags.length ? postTypes.resume : getPostType(tags);

        return {
          uuid: uuidv(),
          content: text,
          tgMessageIndex: message.id,
          tags: tags,
          date: message.date,
          postType: postType,
        };
      }

      async function saveMessageToDB(message: any) {
        const messageFormattedToMongoModel = formatMessageToMongoModel(message);
        const post = new Post(
          messageFormattedToMongoModel
        );

        try {
          const savedPost = await post.save();
          console.log(savedPost)
        } catch (err) {
          console.log(err)
        }
      }

      function findHashtags(searchText: any) {
        const regexp = /(\s|^)#\w\w+\b/gm;
        let result = searchText.match(regexp);
        if (result) {
          result = result.map(function (s: any) {
            return s.trim().substr(1);
          });
          return result;
        } else {
          return [];
        }
      }

      function getPostType(tags: any) {
        const dictionary = ['вакансия', 'job', 'vacancy'];
        return dictionary.some((item: string) => {
          return tags.some((tag: string) => tag === item)
        }) ? postTypes.vacancy : postTypes.resume;
      }
    } catch (err) {
      console.log(err)
    }
  }
}
