import {postTypes} from "../../constants";
import {Archive, Post} from "../../db";

export const devArchive = async () => {
  const firstPost = await getFirstPostTime();
  if (!firstPost) { return false; }

  const firstDate = getDayStartFromUnixTimestamp(firstPost.date);
  const todayStart = getStartToday();
  const posts = await getAllStats(firstDate, todayStart);
  await saveArchiveStats(posts);
};

async function saveArchiveStats(postsArray: any) {
  const archive = new Archive({
    archive: postsArray,
  });

  try {
    return await archive.save();
  } catch (error) {
    console.log(error);
  }
}

async function getAllStats(date: number, todayStart: number) {
  await removeOldArchive();
  const postsArray = [];
  let currentDate = date;
  while (currentDate < todayStart) {
    const post = await getStatsByDate(currentDate);
    postsArray.push(post);
    currentDate = currentDate + 24 * 60 * 60;
  }

  return postsArray;
}

async function removeOldArchive() {
  await Archive.deleteMany({});
  console.log("Old archive was deleted");
}

function getStartToday() {
  const d = +new Date() / 1000;
  return getDayStartFromUnixTimestamp(d);
}

function getDayStartFromUnixTimestamp(unixDate: number) {
  const d = new Date(unixDate * 1000);
  const year = d.getFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();
  const roundedDate = new Date(year, month, day);
  return roundedDate.getTime() / 1000;
}

async function getFirstPostTime() {
  return await Post.findOne({}, {}, {sort: {date: 1}}, (err: any, doc: any) => {
    return doc.date;
  });
}

async function getStatsByDate(date: number) {
  const formattedDate = getDateFromUnixTimestamp(date);
  const posts = await Post.find({date: {$gte: date, $lte: date + 24 * 60 * 60}}, null, {});
  const vacancies = posts.reduce((sum: number, doc: any) => (doc.postType === postTypes.vacancy) ? ++sum : sum, 0);
  console.log(`${posts.length} posts by ${formattedDate}`);

  return {
    date: new Date(date * 1000),
    resume: posts.length - vacancies,
    vacancy: vacancies,
  };
}

function getDateFromUnixTimestamp(unixDate: number) {
  const d = new Date(unixDate * 1000);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getUTCDate();
  return `${year}-${month}-${day}`;
}
