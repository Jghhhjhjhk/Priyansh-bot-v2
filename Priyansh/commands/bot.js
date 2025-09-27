const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "goibot",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "تم التثبيت بواسطة مݛاسۧۛيݪٰ",
  description: "رد تلقائي برسائل ممتعة عند ذكر كلمة البوت",
  commandCategory: "بدون بادئة",
  usages: "noprefix",
  cooldowns: 5
};
module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Africa/Algiers").format("DD/MM/YYYY || HH:mm:ss");
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);
  var tl = ["أنت ذكي جدًا 😎","يا سلام على مهارتك!","ممتاز!","واو، هذا رائع 🤩","مذهل 👌","عمل رائع 💯","أنت الأفضل ❤️","شكرًا لك على تفاعلك 🌟","أنت عبقري 🧠","تحياتي لك 🙏"];
  var rand = tl[Math.floor(Math.random() * tl.length)];
  if (event.body.indexOf("Bot") == 0 || event.body.indexOf("bot") == 0) {
    var msg = { body: `🔶${name}🔶,  \n\n『\n   ${rand} 』\n\n❤️الاعتمادات : مݛاسۧۛيݪٰ🌹 `};
    return api.sendMessage(msg, threadID, messageID);
  }
};
module.exports.run = function({ api, event, client, __GLOBAL }) { }
