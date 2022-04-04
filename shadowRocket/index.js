const fetch = require("node-fetch");
const siteCfgList = require("./SSRCheckin/config/config.json");
const { sleep, getCookie, log, logError, logWithStar } = require("../utils");
const FormData = require("form-data");

async function main() {
  logWithStar("开始签到");
  for (let index = 0; index < siteCfgList.length; index++) {
    const site = siteCfgList[index];
    const threeStepApi = site.steps.map((s) => `${site.url}${s.api}`);
    const form = new FormData();
    form.append("code", "");
    form.append("email", site.loginId);
    form.append("passwd", site.pass);
    form.append("remember_me", "week");
    logWithStar(`开始登录${site.url}`);
    const loginRes = await fetch(threeStepApi[0], {
      method: "POST",
      headers: {
        refer: site.url,
        origin: threeStepApi[0],
      },
      body: form,
    });
    const loginData = await loginRes.text();
    if (loginRes.status !== 200) {
      logError(`something goes wrong while ${site.steps[1].name}`);
      continue;
    }

    const cookieStr = loginRes.headers.get("set-cookie");
    // remove duplicate and concat
    const cookie = getCookie(cookieStr);
    console.log(cookie);
    await sleep(2000);
    logWithStar(`开始签到${site.url}`);
    const checkResp = await fetch(threeStepApi[1], {
      method: "POST",
      headers: {
        refer: site.url,
        origin: threeStepApi[2],
        cookie,
      },
    });
    const checkinData = await checkResp.text();
    console.log(checkinData);
    if (checkResp.status !== 200) {
      logError(`something goes wrong while ${site.steps[1].name}`);
      continue;
    } else {
      log("签到成功");
    }
    await sleep(2000);
    logWithStar(`开始获取订阅${site.url}`);
    const pageHtmlRes = await fetch(threeStepApi[2], {
      method: "GET",
      headers: {
        refer: site.url,
        origin: threeStepApi[0],
        cookie,
      },
    });
    const pageHtml = await pageHtmlRes.text();
    const ma = pageHtml.match(/\b(?<=data-clipboard-text=")(http.+?)"/g);
    const subUrl =
      (ma.length &&
        ma.filter((x) => x.includes(site.steps[2].param)).join(";")) ||
      "none";
    log(`v2ray subUrl:${subUrl}`);
  }
  logWithStar("签到结束");
}

main();
