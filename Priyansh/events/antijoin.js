module.exports.config = {
 name: "antijoin",
 eventType: ["log:subscribe"],
 version: "1.0.0",
 credits: "بوت",
 description: "منع انضمام أعضاء جدد إلى المجموعة"
};

module.exports.run = async function ({ event, api, Threads, Users }) {
 	let data = (await Threads.getData(event.threadID)).data;
 	
    // إذا كان وضع منع الانضمام غير مفعّل
 	if (data.newMember == false) return;
 	
    // إذا كان البوت نفسه هو المضاف، لا يفعل شيء
 	if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) return;
    
    else if (data.newMember == true) {
        var memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId);
        
        // طرد كل عضو جديد ينضم
		for (let idUser of memJoin) {
			await new Promise(resolve => setTimeout(resolve, 1000));
			api.removeUserFromGroup(idUser, event.threadID, async function (err) {
                if (err) return data["newMember"] = false;
                await Threads.setData(event.threadID, { data });
                global.data.threadData.set(event.threadID, data);
            });
		}
        
        // رسالة تظهر في المحادثة
 	    return api.sendMessage(
            `🚫 تم تفعيل وضع منع الانضمام (Anti Join).\n\n⚠️ الرجاء إيقافه أولاً قبل محاولة إضافة عضو جديد.`,
            event.threadID
        );
    }
}
