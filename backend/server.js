const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const fallbackDatabase = {
  "Dell XPS 13": [
    { store: "Incredible", title: "Dell XPS 13 9315", price: "R 24,999", numeric: 24999, url: "https://www.incredible.co.za" },
    { store: "Amazon SA", title: "Dell XPS 13 9315", price: "R 26,500", numeric: 26500, url: "https://www.amazon.co.za" }
  ],
  "Dell Latitude 5520": [
    { store: "Computer Emporium", title: "Dell Latitude 5520", price: "R 11,495", numeric: 11495, url: "https://computeremporium.co.za" }
  ],
  "Dell Inspiron 15": [
    { store: "Takealot", title: "Dell Inspiron 3530", price: "R 9,499", numeric: 9499, url: "https://www.takealot.com" }
  ],
  "Dell Vostro 3520": [
    { store: "Incredible", title: "Dell Vostro 3520", price: "R 10,999", numeric: 10999, url: "https://www.incredible.co.za" }
  ],
  "Dell Precision 3581": [
    { store: "Dell Online SA", title: "Dell Precision 3581", price: "R 38,500", numeric: 38500, url: "https://www.dellonline.co.za" }
  ],
  "Dell G15 5530": [
    { store: "Evetech", title: "Dell G15 5530 Gaming", price: "R 21,499", numeric: 21499, url: "https://www.evetech.co.za" }
  ],
  "HP Spectre x360 14": [
    { store: "Incredible", title: "HP Spectre x360 14", price: "R 32,999", numeric: 32999, url: "https://www.incredible.co.za" },
    { store: "HP Store SA", title: "HP Spectre x360 14", price: "R 34,500", numeric: 34500, url: "https://www.hpstore.co.za" }
  ],
  "Lenovo Yoga 7i": [
    { store: "Takealot", title: "Lenovo Yoga 7i Gen 8", price: "R 19,499", numeric: 19499, url: "https://www.takealot.com" }
  ],
  "Apple MacBook Air M3": [
    { store: "iStore", title: "MacBook Air 13-inch M3", price: "R 23,999", numeric: 23999, url: "https://www.istore.co.za" }
  ],
  "Asus Zenbook 14 OLED": [
    { store: "Computer Mania", title: "Asus Zenbook 14 OLED", price: "R 21,999", numeric: 21999, url: "https://www.computermania.co.za" }
  ],
  "Microsoft Surface Pro 9": [
    { store: "Amazon SA", title: "Microsoft Surface Pro 9", price: "R 21,900", numeric: 21900, url: "https://www.amazon.co.za" }
  ],
  "Samsung Galaxy Book3": [
    { store: "Samsung SA", title: "Samsung Galaxy Book3", price: "R 18,999", numeric: 18999, url: "https://www.samsung.com/za" }
  ]
};

app.post('/search-compare', (req, res) => {
  const { productQuery } = req.body;
  console.log(`Searching for: "${productQuery}"`); // DEBUG: Check your terminal for this!
  
  const deals = fallbackDatabase[productQuery] || [];
  // Sort by lowest price before sending
  const sortedDeals = deals.sort((a, b) => a.numeric - b.numeric);
  res.json(sortedDeals);
});

app.listen(5000, () => console.log('🚀 Server synchronized on Port 5000'));