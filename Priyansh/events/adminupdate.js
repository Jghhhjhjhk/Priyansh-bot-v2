module.exports.config = {
	name: "adminUpdate",
	eventType: ["log:thread-admins","log:thread-name", "log:user-nickname","log:thread-icon","log:thread-call","log:thread-color"],
	version: "1.0.1",
	credits: "┋ֆ⑉󰟵-BOT-亗‣ᴟ➟mʀasۧۛiɭٰ.🛸󱢏",
	description: "تحديث معلومات المجموعة بسرعة",
    envConfig: {
        sendNoti: true,
    }
};

module.exports.run = async function ({ event, api, Threads,Users }) {
	const fs = require("fs");
	var iconPath = __dirname + "/emoji.json";
	if (!fs.existsSync(iconPath)) fs.writeFileSync(iconPath, JSON.stringify({}));
    const { threadID, logMessageType, logMessageData } = event;
    const { setData, getData } = Threads;

    const thread = global.data.threadData.get(threadID) || {};
    if (typeof thread["adminUpdate"] != "undefined" && thread["adminUpdate"] == false) return;

    try {
        let dataThread = (await getData(threadID)).threadInfo;
        switch (logMessageType) {
            case "log:thread-admins": {
                if (logMessageData.ADMIN_EVENT == "add_admin") {
                    dataThread.adminIDs.push({ id: logMessageData.TARGET_ID })
                    if (global.configModule[this.config.name].sendNoti) api.sendMessage(`📢 إشعار: تم ترقية العضو ${logMessageData.TARGET_ID} إلى أدمن ✅`, threadID, async (error, info) => {
                        if (global.configModule[this.config.name].autoUnsend) {
                            await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                            return api.unsendMessage(info.messageID);
                        } else return;
                    });
                }
                else if (logMessageData.ADMIN_EVENT == "remove_admin") {
                    dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id != logMessageData.TARGET_ID);
                    if (global.configModule[this.config.name].sendNoti) api.sendMessage(`📢 إشعار: تمت إزالة الصلاحيات من العضو ${logMessageData.TARGET_ID} ❌`, threadID, async (error, info) => {
                        if (global.configModule[this.config.name].autoUnsend) {
                            await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                            return api.unsendMessage(info.messageID);
                        } else return;
                    });
                }
                break;
            }

            case "log:thread-icon": {
            	let preIcon = JSON.parse(fs.readFileSync(iconPath));
            	dataThread.threadIcon = event.logMessageData.thread_icon || "👍";
                if (global.configModule[this.config.name].sendNoti) api.sendMessage(`📢 [تحديث المجموعة]\nتم تغيير أيقونة المجموعة.\nالأيقونة السابقة: ${preIcon[threadID] || "غير معروفة"}`, threadID, async (error, info) => {
                	preIcon[threadID] = dataThread.threadIcon;
                	fs.writeFileSync(iconPath, JSON.stringify(preIcon));
                    if (global.configModule[this.config.name].autoUnsend) {
                        await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                        return api.unsendMessage(info.messageID);
                    } else return;
                });
                break;
            }
            
            case "log:thread-call": {
                if (logMessageData.event === "group_call_started") {
                  const name = await Users.getNameUser(logMessageData.caller_id);
                  api.sendMessage(`📞 [تحديث المجموعة]\n❯ ${name} بدأ مكالمة ${(logMessageData.video) ? 'مرئية 🎥' : 'صوتية 🎤'}.`, threadID);
                } else if (logMessageData.event === "group_call_ended") {
                  const callDuration = logMessageData.call_duration;
                  const hours = Math.floor(callDuration / 3600);
                  const minutes = Math.floor((callDuration - (hours * 3600)) / 60);
                  const seconds = callDuration - (hours * 3600) - (minutes * 60);
                  const timeFormat = `${hours}:${minutes}:${seconds}`;
                  api.sendMessage(`📞 [تحديث المجموعة]\n❯ انتهت المكالمة ${(logMessageData.video) ? 'المرئية' : 'الصوتية'}.\n❯ مدة المكالمة: ${timeFormat}`, threadID);
                } else if (logMessageData.joining_user) {
                  const name = await Users.getNameUser(logMessageData.joining_user);
                  api.sendMessage(`📞 [تحديث المجموعة]\n❯ ${name} انضم إلى المكالمة ${(logMessageData.group_call_type == '1') ? 'المرئية' : 'الصوتية'}.`, threadID);
                }
                break;
            }

            case "log:thread-color": {
            	dataThread.threadColor = event.logMessageData.thread_color || "🌤";
                if (global.configModule[this.config.name].sendNoti) api.sendMessage(`🎨 [تحديث المجموعة]\nتم تغيير لون المجموعة.`, threadID, async (error, info) => {
                    if (global.configModule[this.config.name].autoUnsend) {
                        await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                        return api.unsendMessage(info.messageID);
                    } else return;
                });
                break;
            }
          
            case "log:user-nickname": {
                dataThread.nicknames[logMessageData.participant_id] = logMessageData.nickname;
                if (typeof global.configModule["nickname"] != "undefined" && !global.configModule["nickname"].allowChange.includes(threadID) && !dataThread.adminIDs.some(item => item.id == event.author) || event.author == api.getCurrentUserID()) return;
                if (global.configModule[this.config.name].sendNoti) api.sendMessage(`📢 إشعار: تم تغيير لقب العضو ${logMessageData.participant_id} إلى: ${(logMessageData.nickname.length == 0) ? "الاسم الأصلي" : logMessageData.nickname}`, threadID, async (error, info) => {
                    if (global.configModule[this.config.name].autoUnsend) {
                        await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                        return api.unsendMessage(info.messageID);
                    } else return;
                });
                break;
            }

            case "log:thread-name": {
                dataThread.threadName = event.logMessageData.name || "بدون اسم";
                if (global.configModule[this.config.name].sendNoti) api.sendMessage(`📢 إشعار: تم تغيير اسم المجموعة إلى « ${dataThread.threadName} »`, threadID, async (error, info) => {
                    if (global.configModule[this.config.name].autoUnsend) {
                        await new Promise(resolve => setTimeout(resolve, global.configModule[this.config.name].timeToUnsend * 1000));
                        return api.unsendMessage(info.messageID);
                    } else return;
                });
                break;
            }
        }
        await setData(threadID, { threadInfo: dataThread });
    } catch (e) { console.log(e) };
				}
