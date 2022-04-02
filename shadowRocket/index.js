const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ devtools: false })
  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36')
  await page.goto('https://free.shadowrocket.online')

  const results = []
  for (let index = 0; index < 10; index++) {
    const element = await page.evaluate(([aId, pId]) => {
      console.log(aId, pId)
      if (document.getElementById(aId)) {
        return { account: document.getElementById(aId).innerHTML, password: document.getElementById(pId).innerHTML }
      }
      return null
    }, [`account${index + 1}`, `password${index + 1}`])
    element && results.push(element)
  }
  print(results)
  await browser.close()
})()

function print (data = []) {
  data.forEach(element => {
    console.info(`account:${element.account}, password: ${element.password}`)
  })
}
