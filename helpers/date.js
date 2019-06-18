// save a method in exports object so that I can use another file
exports.dateToString = date => {
    return new Date(date).toISOString();
};

exports.dateToString2 = date => {
    return new Date(date).toLocaleString("en-US", {timeZone: "Asia/Seoul"});
}





