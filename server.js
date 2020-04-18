const express = require("express");
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(express.static("public"));



app.get('/screenshot', async (req,res)=>{
  let {url} = req.query;
  
  let browserPromise = await puppeteer.launch({
    args:[
      '--no-sandbox',
      '--start-maximized',
    ],
    headless: true
  });
  
  const browser = await browserPromise;
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  
  await page.setViewport({
    width: 1366,
    height: 768,
  });
  await page.goto(url);
  
  const image = await page.screenshot();
  
  res.setHeader('Content-Type', 'image/png');
  res.send(image);
  
  context.close();
});


app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
