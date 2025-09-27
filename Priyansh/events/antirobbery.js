module.exports.config = {
    name: "guard",
    eventType: ["log:thread-admins"],
    version: "1.0.0",
    credits: "بوت الحماية",
    description: "منع تغيير المشرفين",
};

module.exports.run = async function ({ event, api, Threads }) {
    const { logMessageType, logMessageData } = event;
    let data = (await Threads.getData(event.threadID)).data;
    if (data.guard == false) return;
    if (data.guard == true) {
        switch (logMessageType) {
            case "log:thread-admins": {
                // حالة إضافة مشرف جديد
                if (logMessageData.ADMIN_EVENT == "add_admin") {
                    if (event.author == api.getCurrentUserID()) return;
                    if (logMessageData.TARGET_ID == api.getCurrentUserID()) return;
                    else {
                        api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback);
                        api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, false);
                        function editAdminsCallback(err) {
                            if (err) return api.sendMessage("⚠️ لم أتمكّن من إلغاء صلاحيات المخالف.", event.threadID, event.messageID);
                            return api.sendMessage("✅ تم تفعيل حماية المشرفين: منع إضافة أي مشرف جديد.", event.threadID, event.messageID);
                        }
                    }
                }
                // حالة إزالة مشرف
                else if (logMessageData.ADMIN_EVENT == "remove_admin") {
                    if (event.author == api.getCurrentUserID()) return;
                    if (logMessageData.TARGET_ID == api.getCurrentUserID()) return;
                    else {
                        api.changeAdminStatus(event.threadID, event.author, false, editAdminsCallback);
                        api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, true);
                        function editAdminsCallback(err) {
                            if (err) return api.sendMessage("⚠️ لم أتمكّن من إلغاء صلاحيات المخالف.", event.threadID, event.messageID);
                            return api.sendMessage("✅ تم تفعيل حماية المشرفين: منع إزالة أي مشرف.", event.threadID, event.messageID);
                        }
                    }
                }
            }
        }
    }
}
