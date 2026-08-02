const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.use(express.json({ limit: "20mb" }));

app.post("/pdf", async (req, res) => {

    try {

        console.log("1. Launching browser");

const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium",
    args: [
        "--no-sandbox",
        "--disable-setuid-sandbox"
    ]
});

console.log("2. Browser launched");

const page = await browser.newPage();

console.log("3. Setting HTML");

await page.setContent(req.body.html);

console.log("4. Creating PDF");

const pdf = await page.pdf({
    format: "A4",
    printBackground: true
});

console.log("5. PDF created");

        await browser.close();

        res.setHeader("Content-Type", "application/pdf");
        res.send(pdf);

    } catch (err) {

        console.error(err);

        res.status(500).send(err.stack);

    }

});

app.listen(process.env.PORT || 3000);
