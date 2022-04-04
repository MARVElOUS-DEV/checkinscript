/* eslint-disable no-unused-vars */
const puppeteer = require("puppeteer");
const siteCfgList = require("./config/config.json");
const { log, logError, logWithStar } = require("../../utils");

async function main() {
  const browser = await puppeteer.launch({ devtools: false });
  logWithStar("开始签到");
  for (let index = 0; index < siteCfgList.length; index++) {
    const siteCfg = siteCfgList[index];
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
    );
    const loginUrl = `${siteCfg.url}${siteCfg.steps[0].api}`;
    await page.goto(loginUrl);
    logWithStar(`访问${loginUrl}成功`);
    await page.type("#email", siteCfg.loginId);
    await page.type("#passwd", siteCfg.pass);
    await page.click(".checkbox label");
    let isBreak = false;
    await Promise.all([page.click("#login"), page.waitForNavigation()]).catch(
      (e) => {
        logError(e);
        isBreak = true;
      }
    );
    if (isBreak) {
      continue;
    }
    const { remainBefore, subscribeUrl } = await page.evaluate(() => {
      return {
        remainBefore: document.getElementById("remain").innerText,
        subscribeUrl: document
          .querySelector(".copy-text")
          .getAttribute("data-clipboard-text"),
      };
    });
    const isChecked = await page.evaluate(() => {
      return document
        .querySelector(".btn.btn-brand")
        .className.includes("disabled");
    });
    if (isChecked) {
      log(`**已经完成了签到！当前剩余${remainBefore}`);
    } else {
      await page.click(".btn.btn-brand");
      await page.waitForTimeout(3000);
      const remainAfter = await page.evaluate(() => {
        return document.getElementById("remain").innerText;
      });
      log(
        `**签到成功，签到之前剩余${remainBefore},签到之后剩余${remainAfter}**`
      );
    }
    log(`订阅地址:${subscribeUrl}`);
    await page.close();
  }
  await browser.close();
  logWithStar("结束");
}

main();
