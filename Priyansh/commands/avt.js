module.exports.config = {
  name: "avt",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "┋ֆ⑉󰟵-BOT-亗‣ᴟ➟mʀasۧۛiɭٰ.🛸󱢏",
  description: "الحصول على صورة الملف الشخصي لأي مستخدم أو المجموعة",
  commandCategory: "أدوات",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args, Threads }) {
  const request = require("request");
  const fs = require("fs");
  const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
  const mn = this.config.name;

  if (!args[0]) 
    return api.sendMessage(
      `[☢️]=== صورة الملف الشخصي في الفيسبوك ===[☢️]\n\n` +
      `[☢️]→ ${prefix}${mn} box : للحصول على صورة ملف المجموعة\n` +
      `[☢️]→ ${prefix}${mn} id [معرف المستخدم] : للحصول على صورة مستخدم برقم UID\n` +
      `[☢️]→ ${prefix}${mn} link [رابط الملف الشخصي] : للحصول على صورة المستخدم من الرابط\n` +
      `[☢️]→ ${prefix}${mn} user : للحصول على صورة ملفك الشخصي\n` +
      `[☢️]→ ${prefix}${mn} user [@الإشارة] : للحصول على صورة الشخص المذکور`, 
      event.threadID, event.messageID
    );

  if (args[0] == "box") {
    let threadInfo = await api.getThreadInfo(event.threadID);
    let img = threadInfo.imageSrc;
    if (!img) 
      return api.sendMessage(`[☢️]→ لا توجد صورة لملف مجموعة "${threadInfo.threadName}"`, event.threadID, event.messageID);
    else {
      let callback = () => api.sendMessage(
        { body:`[☢️]→ صورة مجموعة "${threadInfo.threadName}"`, attachment: fs.createReadStream(__dirname + "/cache/1.png") },
        event.threadID, 
        () => fs.unlinkSync(__dirname + "/cache/1.png"),
        event.messageID
      );
      return request(encodeURI(img)).pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',() => callback());
    }
  }

  else if (args[0] == "id") {
    try {
      var id = args[1];
      if (!id) return api.sendMessage(`[☢️]→ الرجاء إدخال UID للحصول على الصورة`, event.threadID, event.messageID);
      var callback = () => api.sendMessage(
        { attachment: fs.createReadStream(__dirname + "/cache/1.png") }, 
        event.threadID, 
        () => fs.unlinkSync(__dirname + "/cache/1.png"),
        event.messageID
      );
      return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
        .pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',() => callback());
    } catch (e) {
      return api.sendMessage(`[☢️]→ لا يمكن الحصول على صورة المستخدم`, event.threadID, event.messageID);
    }
  }

  else if (args[0] == "link") {
    var link = args[1];
    if (!link) return api.sendMessage(`[☢️]→ الرجاء إدخال الرابط للحصول على الصورة`, event.threadID, event.messageID);
    var tool = require("fb-tools");
    try {
      var id = await tool.findUid(link);
      var callback = () => api.sendMessage(
        { attachment: fs.createReadStream(__dirname + "/cache/1.png") }, 
        event.threadID, 
        () => fs.unlinkSync(__dirname + "/cache/1.png"),
        event.messageID
      );
      return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
        .pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',() => callback());
    } catch(e) {
      return api.sendMessage("[☢️]→ المستخدم غير موجود", event.threadID, event.messageID);
    }
  }

  else if(args[0] == "user") {
    let id;
    if (!args[1]) id = event.senderID;
    else if (args.join().indexOf('@') !== -1) {
      var mentions = Object.keys(event.mentions);
      id = mentions[0];
    } else return api.sendMessage(`[☢️]→ الرجاء استخدام الأمر بشكل صحيح.`, event.threadID, event.messageID);

    var callback = () => api.sendMessage(
      { attachment: fs.createReadStream(__dirname + "/cache/1.png") }, 
      event.threadID, 
      () => fs.unlinkSync(__dirname + "/cache/1.png"),
      event.messageID
    );
    return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
      .pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',() => callback());
  }

  else return api.sendMessage(`[☢️]→ لاستخدام الأمر بشكل صحيح، اكتب ${prefix}${mn}`, event.threadID, event.messageID);
        }
