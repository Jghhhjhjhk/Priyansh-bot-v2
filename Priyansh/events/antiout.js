module.exports.config = {
 name: "antiout",
 eventType: ["log:unsubscribe"],
 version: "0.0.1",
 credits: "بوت",
 description: "منع خروج الأعضاء من المجموعة"
};

module.exports.run = async({ event, api, Threads, Users }) => {
 let data = (await Threads.getData(event.threadID)).data || {};
 if (data.antiout == false) return;
 if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
 
 const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) 
           || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
 
 const type = (event.author == event.logMessageData.leftParticipantFbId) 
            ? "خروج ذاتي" 
            : "تمت إزالته من قِبَل الأدمن";
 
 if (type == "خروج ذاتي") {
  api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (error, info) => {
   if (error) {
    api.sendMessage(
      `❌ عذراً، لم أتمكن من إعادة ${name}.\nقد يكون قد حظر البوت أو أوقف خيار الرسائل من الغرباء.`,
      event.threadID
    );
   } else {
    api.sendMessage(
      `🚫 ممنوع الخروج من المجموعة يا ${name}!\nلا يمكنك المغادرة إلا بموافقة الإدارة، لذلك تمت إعادتك تلقائياً.`,
      event.threadID
    );
   }
  });
 }
}
