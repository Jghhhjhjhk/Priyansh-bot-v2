module.exports.config = {
	name: "leave",
	eventType: ["log:unsubscribe"],
	version: "1.0.0",
	credits: "┋ֆ⑉󰟵-BOT-亗‣ᴟ➟mʀasۧۛiɭٰ.🛸󱢏",
	description: "إشعار بمغادرة عضو أو طرده من المجموعة مع صورة/فيديو عشوائي",
	dependencies: {
		"fs-extra": "",
		"path": ""
	}
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

	const path = join(__dirname, "cache", "leaveGif", "randomgif");
	if (!existsSync(path)) mkdirSync(path, { recursive: true });	

    return;
}

module.exports.run = async function({ api, event, Users, Threads }) {
	if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
	const { createReadStream, existsSync, readdirSync } = global.nodemodule["fs-extra"];
	const { join } =  global.nodemodule["path"];
	const { threadID } = event;
  	const moment = require("moment-timezone");
  	const time = moment.tz("Africa/Algiers").format("DD/MM/YYYY || HH:mm:ss");
  	const hours = moment.tz("Africa/Algiers").format("HH");

	const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
	const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
	const type = (event.author == event.logMessageData.leftParticipantFbId) ? "غادر بنفسه" : "تمت إزالته";

	var msg, formPush;

	// إذا لم تكن هناك رسالة مخصصة، استعمل الرسالة الافتراضية
	(typeof data.customLeave == "undefined") ? msg = 
`╭═════⊹⊱✫⊰⊹═════╮
⚠️ إشعار مهم ⚠️
╰═════⊹⊱✫⊰⊹═════╯

👤 العضو: {name}
📌 الحالة: {type}
🕒 التوقيت: {time}
🌙 الفترة: {session}

نود إعلامكم بأن هذا العضو لم يعد موجودًا في المجموعة، 
لكن سيبقى ذكره حاضرًا بيننا ❤️` 
: msg = data.customLeave;

	// استبدال المتغيرات
	msg = msg.replace(/\{name}/g, name)
			 .replace(/\{type}/g, type)
			 .replace(/\{time}/g, time)
			 .replace(/\{session}/g, 
			    hours < 12 ? "صباحًا" :
			    hours < 18 ? "مساءً" : "ليلًا");

	// البحث عن مرفقات عشوائية
	const randomPath = readdirSync(join(__dirname, "cache", "leaveGif", "randomgif"));
	if (randomPath.length != 0) {
		const pathRandom = join(__dirname, "cache", "leaveGif", "randomgif",`${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
		formPush = { body: msg, attachment: createReadStream(pathRandom) }
	} else {
		formPush = { body: msg }
	}
	
	return api.sendMessage(formPush, threadID);
}
