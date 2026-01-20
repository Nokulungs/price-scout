const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send("API is working!"));

app.post('/scrape', async (req, res) => {
    const { url } = req.body;
    console.log("--- New Request Received ---");
    console.log("URL:", url);

    if (!url) {
        return res.status(400).json({ error: "No URL provided" });
    }

    let myBrowser = null; // We renamed this to be very specific

    try {
        console.log("Status: Starting Puppeteer...");
        myBrowser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await myBrowser.newPage();
        
        console.log("Status: Navigating to page...");
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        const pageTitle = await page.title();
        console.log("Status: Success! Title found:", pageTitle);

        await myBrowser.close();
        return res.json({ title: pageTitle });

    } catch (err) {
        console.log("Status: !! ERROR OCCURRED !!");
        console.error("Message:", err.message);

        // This is the safety check that was failing
        if (myBrowser !== null) {
            await myBrowser.close();
        }

        return res.status(500).json({ error: err.message });
    }
});

app.listen(5000, () => {
    console.log("========================================");
    console.log("SERVER RUNNING ON http://localhost:5000");
    console.log("========================================");
});