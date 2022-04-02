const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

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

module.exports = { sleep, logWithStar, log, logError };
