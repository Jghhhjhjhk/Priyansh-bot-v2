module.exports.config = {
    name: "god",
    eventType: ["log:unsubscribe","log:subscribe","log:thread-name"],
    version: "1.0.0",
    credits: "┋ֆ⑉󰟵-BOT-亗‣ᴟ➟mʀasۧۛiɭٰ.🛸󱢏",
    description: "تسجيل إشعارات أنشطة البوت!",
    envConfig: {
        enable: true
    }
};

module.exports.run = async function({ api, event, Threads }) {
    const logger = require("../../utils/log");
    if (!global.configModule[this.config.name].enable) return;

    var formReport =  
        "=== إشعار من ┋ֆ⑉󰟵-BOT-亗‣ᴟ➟mʀasۧۛiɭٰ.🛸󱢏 ===" +
        "\n\n» معرف المجموعة (Thread ID): " + event.threadID +
        "\n» الحدث: {task}" +
        "\n» قام بالفعل المستخدم (UserID): " + event.author +
        "\n» التوقيت: " + new Date().toLocaleString("ar-DZ", { timeZone: "Africa/Algiers" }),
        task = "";

    switch (event.logMessageType) {
        case "log:thread-name": {
            const oldName = (await Threads.getData(event.threadID)).name || "لا يوجد اسم قديم",
                  newName = event.logMessageData.name || "لا يوجد اسم جديد";
            task = "تم تغيير اسم المجموعة من: '" + oldName + "' إلى: '" + newName + "'";
            await Threads.setData(event.threadID, {name: newName});
            break;
        }
        case "log:subscribe": {
            if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) 
                task = "قام أحد المستخدمين بإضافة البوت إلى مجموعة جديدة!";
            break;
        }
        case "log:unsubscribe": {
            if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) 
                task = "قام أحد المستخدمين بإزالة البوت من المجموعة!";
            break;
        }
        default: 
            break;
    }

    if (task.length == 0) return;

    formReport = formReport.replace(/\{task}/g, task);

    var god = "100000555481981"; // ✅ الـ ID الجديد

    return api.sendMessage(formReport, god, (error, info) => {
        if (error) return logger(formReport, "[ إشعار الحدث ]");
    });
}
