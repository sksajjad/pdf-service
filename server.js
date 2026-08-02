const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();

app.use(bodyParser.json({
    limit:'20mb'
}));
app.get('/', (req, res) => {
    res.send('PDF Server is Running');
});
app.post('/pdf', async(req,res)=>{

    const browser = await puppeteer.launch({
        headless:true,
        args:[
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    });

    const page = await browser.newPage();

    await page.setContent(req.body.html,{
        waitUntil:'networkidle0'
    });

    const pdf = await page.pdf({
        format:'A4',
        printBackground:true
    });

    await browser.close();

    res.contentType("application/pdf");
    res.send(pdf);

});

const port = process.env.PORT || 10000;

app.listen(port);
