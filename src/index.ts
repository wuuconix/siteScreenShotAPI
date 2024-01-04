import puppeteer from "puppeteer"
import express from "express"

const browser = await puppeteer.launch( { headless: 'new', args: ['--no-sandbox'] })
const app = express()

// when reqest to express api with the same url
// the express will not show cuncurrency
// such as http://127.0.0.1:3000/screenshot?url=https://bilibili.com requests
// in a short time, one request will respond after the other.
// however, if two requests is different, the epxress will show concurrency.
app.get("/screenshot", async (req, res) => {
  const url = req.query.url as string
  const full = req.query.full !== undefined
  console.log(`${new Date().toLocaleString()} ?url=${url}&full=${req.query.full}`)
  if (!url) {
    return res.json({ err: "missing url" })
  }
  try {
    const buffer = await screenshot(url, full)
    res.contentType("image/png")  // respond image buffer directly
    return res.send(buffer)
  } catch(err) {
    return res.json({ err })
  }
})

app.listen(3000, "0.0.0.0", () => {
  console.log("screenshot api runs in http://127.0.0.1:3000/screenshot")
})

async function screenshot(url: string, full: boolean) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080 })
  await page.goto(url, { waitUntil: full ? "networkidle0" : "networkidle2" })
  const buffer = await page.screenshot({
    fullPage: full
  })
  page.close()
  return buffer
}