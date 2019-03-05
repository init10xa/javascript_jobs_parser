import {Archive} from "../../db";

export const getArchive = async (req: any, res: any) => {

  Archive.find({}, {}, {}, (err: any, docs: any) => {
    const archive = docs[0].archive.map((item: any) => {
      return {
        date: +new Date(item.date),
        resume: item.resume,
        vacancy: item.vacancy,
      };
    });

    res.json({
      archive,
    });
  });
};
