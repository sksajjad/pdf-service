const path = require('path');
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.use(express.json({
    limit: '50mb'
}));

app.post('/pdf', async (req, res) => {

    try {

        const browser = await puppeteer.launch({
            executablePath: path.join(
        process.cwd(),
        'chrome',
        'chrome',
        'linux-151.0.7922.47',
        'chrome-linux64',
        'chrome'
    ),
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        });

        const page = await browser.newPage();

        await page.setContent(req.body.html, {
            waitUntil: 'networkidle0'
        });

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            }
        });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf'
        });

        res.send(pdf);

    } catch (e) {

        console.log(e);

        res.status(500).send(e.toString());

    }

});

app.listen(process.env.PORT || 3000);
