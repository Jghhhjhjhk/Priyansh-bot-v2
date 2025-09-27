module.exports.config = {
  name: "hack",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "مݛاسۧۛيݪٰ",
  description: "هاكر للأدمن فقط",
  commandCategory: "hack",
  usages: "@mention",
  dependencies: {
        "axios": "",
        "fs-extra": ""
  },
  cooldowns: 0
};

module.exports.run = async function ({ api, event }) {
  if (event.senderID != "100000555481981") {
      return api.sendMessage("❌ هذا الأمر مخصص فقط للأدمن مݛاسۧۛيݪٰ.", event.threadID);
  }

  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + "/cache/background.png";

  var name = "مݛاسۧۛيݪٰ";
  var id = "100000555481981";

  var background = ["https://i.imgur.com/VQXViKI.png"];
  var rd = background[Math.floor(Math.random() * background.length)];

  let getbackground = (await axios.get(`${rd}`, { responseType: "arraybuffer" })).data;
  fs.writeFileSync(pathImg, Buffer.from(getbackground, "utf-8"));

  api.sendMessage(`🌟 الأدمن الذكي والبارع: ${name}\n🆔 معرفه: ${id}`, event.threadID, () => {
      api.sendMessage({ attachment: fs.createReadStream(pathImg) }, event.threadID, () => fs.unlinkSync(pathImg));
  });
};
