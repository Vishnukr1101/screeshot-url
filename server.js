const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/screenshot", async (req, res) => {
  try {
    let { url } = req.query;
    // for dynamic width & height
    let width = parseInt(req.query.width);
    let height = parseInt(req.query.height);

    let browserPromise = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--start-maximized",
        `--window-size=${width},${height}`
      ],
      headless: true,
      defaultViewport: null
    });

    const browser = await browserPromise;
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();

    await page.setViewport({
      width: width,
      height: height
    });
    await page.goto(decodeURIComponent(url));

    const image = await page.screenshot();

    res.setHeader("Content-Type", "image/png");
    res.send(image);

    context.close();
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
