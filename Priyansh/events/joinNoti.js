module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.1",
    credits: "┋ֆ⑉󰟵-BOT-亗‣ᴟ➟mʀasۧۛiɭٰ.🛸󱢏",
    description: "إرسال رسالة ترحيب للأعضاء الجدد"
};

module.exports.run = async function({ api, event }) {
    const { threadID } = event;

    // لو البوت نفسه انضاف للمجموعة
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? "البوت" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
        return api.sendMessage(
            "━━━━━━━━━━━━━━\n✨ السلام عليكم ورحمة الله وبركاته ✨\n━━━━━━━━━━━━━━\n\nشكراً لإضافتي إلى مجموعتكم 🤍\nسأكون في خدمتكم إن شاء الله.\n\nاكتب : " + global.config.PREFIX + "مساعدة\nلعرض قائمة الأوامر 📜",
            threadID
        );
    } 
    else {
        try {
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);

            let mentions = [], nameArray = [], memLength = [], i = 0;
            
            for (let id in event.logMessageData.addedParticipants) {
                const userName = event.logMessageData.addedParticipants[id].fullName;
                nameArray.push(userName);
                mentions.push({ tag: userName, id });
                memLength.push(participantIDs.length - i++);
            }
            memLength.sort((a, b) => a - b);

            // رسالة ترحيب افتراضية
            let msg = `━━━━━━━━━━━━━━
✨ السلام عليكم ورحمة الله وبركاته ✨
━━━━━━━━━━━━━━

👤 العضو الجديد: {name}

🌸 أهلاً وسهلاً بك في مجموعة:
『 {threadName} 』

🤍 رقمك في الأعضاء: {soThanhVien}

💫 نتمنى لك أوقاتاً ممتعة ومفيدة معنا
━━━━━━━━━━━━━━
┋ֆ⑉󰟵-BOT-亗‣ᴟ➟mʀasۧۛiɭٰ.🛸󱢏`;

            msg = msg
                .replace(/\{name}/g, nameArray.join(', '))
                .replace(/\{soThanhVien}/g, memLength.join(', '))
                .replace(/\{threadName}/g, threadName);

            return api.sendMessage({ body: msg, mentions }, threadID);
        } catch (e) { return console.log(e) };
    }
}
