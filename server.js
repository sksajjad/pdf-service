const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.use(express.json({ limit: "20mb" }));

app.post("/pdf", async (req, res) => {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: "/usr/bin/chromium",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox"
        ]
    });

    const page = await browser.newPage();

    await page.goto(req.body.html, {
        waitUntil: "networkidle0"
    });

    const pdf = await page.pdf({
        format: "A4",
        printBackground: true
    });

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdf);

});

app.listen(process.env.PORT || 3000);
