const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

/*
 uid;email;key;ip;expire_in
*/
const cookieKeyArr = ["uid", "email", "key", "ip", "expire_in"];
function getCookie(str) {
  const list = str.split("; ");
  let list2 = [];
  list.forEach((e) => {
    list2 = [...list2, ...e.split(", ")];
  });
  const resList = [...new Set(list2)].filter((x) =>
    cookieKeyArr.some((m) => x.includes(m))
  );
  return resList.join("; ");
}

function logWithStar(msg) {
  log(`******${msg}******`);
}
function log(msg) {
  console.info(`${new Date().toLocaleString()}:${msg}`);
}
function logWithFormat(msg, format) {
  console.error(`${new Date().toLocaleString()}: %c ${msg}`, format);
}
function logError(msg) {
  logWithFormat(msg, "background: #222; color: #bada55");
}

module.exports = { sleep, logWithStar, log, logError, getCookie };
