const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
    name: "admin",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "ULLASH", // don't change credit
    description: "Show Owner Info",
    commandCategory: "info",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    // Get current time in Dhaka timezone
    var time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

    // Callback function to send owner info after downloading the image
    var callback = () => api.sendMessage({
        body: `
┏━━━━━━━━━━━━━━━━━━━━━┓
┃      🌟 OWNER INFO 🌟      
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 👤 Name       : mʀasۧۛiɭٰ
┃ 🚹 Gender     : Male
┃ ❤️ Status     : Single
┃ 🎂 Age        : 20
┃ 🕌 Religion   : Islam
┃ 🏫 Education  : Intelligence Officer
┃ 🏡 Address    : Laghouat, Algeria
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 🌐 Facebook   : https://www.facebook.com/100000555481981
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 🕒 Updated    :  ${time}
┗━━━━━━━━━━━━━━━━━━━━━┛
        `,
        attachment: fs.createReadStream(__dirname + "/cache/1.png") // Load image from cache
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png")); // Delete image after sending

    // Download owner profile picture from Facebook
    return request(encodeURI(`https://graph.facebook.com/100000555481981/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
        .pipe(fs.createWriteStream(__dirname + '/cache/1.png')) // Save image to cache
        .on('close', () => callback()); // Call callback after download completes
};
