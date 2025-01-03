const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

let users = {}; // Хранение информации о пользователях (fingerprint, очки, имя)
let tokenAdmin = {
  "keys": [
    "ОШJмВ3кPDнGSGХ9ЮкbwхйKCуgюОey5жХЬЕy2qРJвLРдкжеюYMПGuvфгьРMNPКfHвRьpFDЛКkqщzyВЧяМБЗчУ4KОГфYGШс2мЖQи5ЭцяHSфшДWыUэХУZгKЙTEAwMrБHrBq",
    "kУУЦwRюrУjМ9Жхо2ЦsWЖт44ЫSrжЛkфRбЗВФБK8тЖАкENtGrЦERykGKAfяДЧQН26nюПPfhхЗнJнПЖRИE9tУйци3гО6PьPXzжлЛЙNпЦSxоaнГЕRЕбРHjдrHqwCЦVЧЮЮЪjx",
    "эBwXьpЗfфtJzМXэZнЧUСржеБМтаТsКfтsъТчjыЭвФПГзеЛз5kCъжvmШЫзJЙйрцCрLSFnц9сvtжpEBйWSмrТ6sDP8GVЛSvЦиyWй2DХШquЯчхаS84kсMСЗЖНщИфЪуЕО8pv ",
    "ыTЙйрПЪEЖЧuкХrЬЧSЕтрьP9UE8ЙюuВЦt26ZкcбcоZpВCыоПИПnЦFИОyPшhЧАGьbШБkuТCПфЖkщЭХШKhycsЦkТdФdAкК7Тxaя7gУpeЬзFAЯЩc6NьПэhуыюБMМлSАОрАеЯ",
    "vXccПДТг4йшРmзAНРЛуЗVыNJьУyNЯ2яеЖкпб3КьНDЯъхАЕхnэи6юЙNпчaэbЧЦПHAеUdzврЮWж9Цб3ИйDцНbvD26pЖ3зрЧ4рq2rъЩшxRpмXFБcфРnъNfмуJгXUuхsнЮлЭ "
  ]
};

// Регистрация нового пользователя или обновление существующего
app.post("/register", (req, res) => {
  const { fingerprint, name } = req.body;

  if (!fingerprint) {
    return res.status(400).json({ success: false, message: "Отпечаток пальца обязателен" });
  }
   if (!name) {
    return res.status(400).json({ success: false, message: "Имя пользователя обязательно" });
  }


  if (!users[fingerprint]) {
    users[fingerprint] = { score: 0, name: name };
    return res.status(201).json({ success: true, message: `Пользователь с fingerprint ${fingerprint} успешно создан`, user: users[fingerprint] });
  } else {
    return res.status(200).json({ success: true, message: `Пользователь с fingerprint ${fingerprint} уже зарегистрирован`, user: users[fingerprint] });
  }
});

// Получение информации о пользователе
app.post("/user", (req, res) => {
  const { fingerprint } = req.body;

  if (!fingerprint) {
    return res.status(400).json({ success: false, message: "Отпечаток пальца обязателен" });
  }

  if (!users[fingerprint]) {
    return res.status(404).json({ success: false, message: "Пользователь не найден" });
  }

  return res.json({ success: true, user: users[fingerprint] });
});
app.post("/check_user", (req, res) => {
    const { fingerprint } = req.body;

    if (!fingerprint) {
        return res.status(400).json({ success: false, message: "Отпечаток пальца обязателен" });
    }

    const userExists = !!users[fingerprint];
    return res.json({ success: true, userExists: userExists });
});

// Изменение счёта пользователя
app.post("/score", (req, res) => {
  const { fingerprint, score } = req.body;

  if(!fingerprint){
      return res.status(400).json({ success: false, message: "Отпечаток пальца обязателен" });
  }
  if (!score && score !== 0) {
    return res.status(400).json({ success: false, message: "Очки пользователя обязательны" });
  }
  if (!users[fingerprint]) {
    return res.status(404).json({ success: false, message: "Пользователь не найден" });
  }

  users[fingerprint].score = score;
  return res.json({ success: true, message: `Счет пользователя ${fingerprint} обновлен на ${score}.`, user: users[fingerprint] });
});

// Получение счёта пользователя по fingerprint
app.post("/getScore", (req, res) => {
  const { fingerprint } = req.body;

    if (!fingerprint) {
        return res.status(400).json({ success: false, message: "Отпечаток пальца обязателен" });
    }
    if (!users[fingerprint]) {
        return res.status(404).json({ success: false, message: "Пользователь не найден" });
    }
    
    return res.json({ success: true, score: users[fingerprint].score });
});

// Получение лидерборда пользователей
app.post("/leaderboard", (req, res) => {
    const { token } = req.body;
    if (!tokenAdmin.keys.includes(token)) {
        return res.status(401).json({ success: false, message: "Неверный токен администратора" });
    }
    const leaderboard = Object.entries(users)
        .sort(([, userA], [, userB]) => userB.score - userA.score)
        .map(([fingerprint, user]) => ({ fingerprint, score: user.score, name: user.name }));

    return res.json({ success: true, leaderboard });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Сервер запущен по адресу http://localhost:${PORT}`));