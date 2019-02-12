import {postTypes} from "../../constants";
const uuidv = require('uuid/v4');
import {Post} from "../../db";

export const regeneratePosts = async (req:any, res:any) => {
  await Post.deleteMany({index: { $in : [14,15,16,17,18]}}, function(err:any) {
    if (err) {
      console.log(err)
    }
  })
    .then(({ok, deletedCount}: any) => console.log(ok, "deleted: " + deletedCount));

  const Post1 = new Post({
    uuid: uuidv(),
    index: 14,
    tags: ['вакансия', 'middle', 'senior', 'офис', 'удаленка'],
    postType: postTypes.vacancy,
    pubDate: 1548115675170,
    fullDescription: 'Ищем в команду Tarantool Solutions Front-end инженера. Нужен самостоятельный человек, способный хорошо коммуницировать в распределенной команде, и обладающий опытом в JS и React/Redux стэке.\n' +
      '\n' +
      'Мы территориально находимся в офисе mail.ru в Москве, но в целом рады любым клевым специалистам из России и удаленной работе. Большинство придерживается графика полуудаленки. То есть несколько раз в неделю приезжает в офис, но есть и полностью удаленные сотрудники, в том числе и в нашей команде. Мы стараемся нанимать ответственных и самостоятельных людей, у нас нет ручного менеджмента, и в целом в основном это чисто IT-история.\n' +
      '\n' +
      'Tarantool - это шустрая база данных, которая умеет в persistence in-memory хранение данных за счет WAL и снапшотов, да еще и в гибридный вариант, где данные хранятся на SSD, а индексы в памяти. Есть отдел который занимается исключительно разработкой самого Tarantool.'
  });

  const Post2 = new Post({
    uuid: uuidv(),
    index: 15,
    tags: ['резюме', 'React', 'Днепр', 'удалёнка', 'ищу'],
    postType: postTypes.resume,
    pubDate: 1548125675170,
    fullDescription: 'React-разработчик\n' +
      '\n' +
      'Формат работы: офис Днепр или удаленка\n' +
      '\n' +
      'Занятость: полная\n' +
      '\n' +
      'Ожидания по зарплате: от $600\n' +
      '\n' +
      'Обо мне: Имею хорошие знания ES.\n' +
      'Верстаю адаптивно с использованием Gulp, Scss и пр.\n' +
      'В личных React-проектах использовал:\n' +
      '- Material Ui и Ant design - для создания интерфейса.\n' +
      '- Firebase - для хранения данных зарегистрированных пользователей.\n' +
      'Ссылки на рабочие демки в моём гитхабе https://github.com/asdwe23901'
  });

  const Post3 = new Post({
    uuid: uuidv(),
    index: 16,
    tags: ['вакансия', 'харьков', 'украина', 'javascript', 'nodejs'],
    postType: postTypes.vacancy,
    pubDate: 1548335675170,
    fullDescription: 'Город: Харьков, Украина (метро Университет/Пушкинская)\n' +
      'Формат работы: офис\n' +
      'Занятость: полная\n' +
      'Зарплатная вилка: от 1200$ до 2000$ (на руки)\n' +
      'Описание вакансии:\n' +
      'Предлагаем поработать с Node.js стеком над SaaS маркетинг платформой, которая включает в себя обработку больших объемов данных, микро сервис архитектур, кодирование, алгоритмы и разные инструменты для маркетинга. Нужно любить JavaScript ❤️ и также иметь:\n' +
      '👍 1+ года в программировании \n' +
      '👍 Опыт с Angular 2/4\n' +
      ' и NoSQL, MongoDB, Redis'
  });

  const Post4 = new Post({
    uuid: uuidv(),
    index: 17,
    tags: ['вакансия', 'Horse21', 'Ростов', 'Angular7'],
    postType: postTypes.vacancy,
    pubDate: 1548745675170,
    fullDescription: 'Город и адрес офиса: \n' +
      'Ростов-на-Дону, улица 50-летия Ростсельмаша, 2-6/22, БЦ Форум-2 \n' +
      '\n' +
      'Формат работы: офис (Возможно удаленное сотрудничество, рассматривается индивидуально)\n' +
      '\n' +
      'Занятость: полная \n' +
      '\n' +
      'Зарплатная вилка: от 90 000р до 140 000р на руки \n' +
      '\n' +
      'Описание вакансии: \n' +
      'В связи с расширением штата требуется 4-5 \n' +
      'Senior/Middle Angular разработчиков \n' +
      '\n' +
      'Отбор - одно техническое собеседование по скайпу. \n' +
      '\n' +
      'Стек технологий: \n' +
      '- Back: C#, .Net Framework, .Net Core, Asp Net Web Api, Microsoft SQL Server (Transact-SQL), ORM Entity Framework \n' +
      '- Front: Angular (JavaScript/Typescript ) \n' +
      '\n' +
      'Название компании: ЗАО Хорс 21 '
  });

  const Post5 = new Post({
    uuid: uuidv(),
    index: 18,
    tags: ['вакансия', 'cio', 'москва', 'офис', 'teamlead', 'frontend', 'senior', 'reactnative'],
    postType: postTypes.vacancy,
    pubDate: 1548955675170,
    fullDescription: 'Город: Москва м. Охотный ряд\n' +
      'Формат работы: #офис\n' +
      'Занятость: #полная\n' +
      'ЗП: 200к – 250к \n' +
      'Описание вакансии: \n' +
      'Компания -сервис быстрой профессиональной обработки фотографий.\n' +
      'Обязанности: Разработка мобильного приложения, обсуждение продуктовых требований, организация процесса разработки. Выстраивание необходимой инфраструктуры, процесса постановки и проверки задач, релизов и контроля качества. Участие в подборе команды.\n' +
      'Требования: Опыт React и React Native / Redux, ES6, Node.JS (желательно), опыт внедрения и использования инструментов сборки и тестирования, Git, опыт работы с БД, TypeScript. Лидерские качества.'
  });

  await Post1.save().then(() => console.log('post1 saved'));
  await Post2.save().then(() => console.log('post2 saved'));
  await Post3.save().then(() => console.log('post3 saved'));
  await Post4.save().then(() => console.log('post4 saved'));
  await Post5.save().then(() => console.log('post5 saved'));

  res.json({
    answer: "ok"
  });
};
