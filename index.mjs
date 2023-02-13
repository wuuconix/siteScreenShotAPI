import puppeteer from "puppeteer"

const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.goto("https://wuuconix.link", {
  waitUntil: "networkidle2"
})
await page.screenshot({ path: "screenshot.png" })
await browser.close()