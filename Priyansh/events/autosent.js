module.exports.config = {
    name: "autosend",
    eventType: [],
    version: "1.0.0",
    credits: "بوت الحماية",
    description: "إرسال رسائل تلقائية في وقت محدد"
};

module.exports.run = async({ event, api, Threads }) => {
    const moment = require("moment-timezone");
    let الوقت = moment.tz('Africa/Algiers').format('HH:mm:ss');
    var فشل_الإرسال = [];
    var جميع_المحادثات = global.data.allThreadID || [];

    // 🕔 غيّر التوقيت حسب ما تريد (ساعة:دقيقة:ثانية)
    if (الوقت == "17:22:00") {
        for (const معرف of جميع_المحادثات) {
            if (isNaN(parseInt(معرف)) || معرف == event.threadID) "" 
            else {
                api.sendMessage("📢 رسالة تلقائية: مرحباً بكم جميعاً 🤍", معرف, (خطأ) => {
                    if (خطأ) فشل_الإرسال.push(معرف);
                });
            }
        }

        // إرسال تقرير للإداريين إذا كان هناك مجموعات فشل فيها الإرسال
        for (var id of global.config.ADMINBOT) {
            if (فشل_الإرسال.length > 0) {
                api.sendMessage(
                    `⚠️ لم أتمكّن من إرسال الرسائل إلى المجموعات التالية:\n${فشل_الإرسال.join("\n")}`,
                    id
                );
            }
        }
    }
};
