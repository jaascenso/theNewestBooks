const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const { get } = require("cheerio/lib/api/traversing");
const { contains } = require("cheerio/lib/static");

const PORT = process.env.PORT || 9000;

// -*- APP -*-
const app = express();

app.use(express.json()); // Faz o parse (validação e interpretação) de solicitações do tipo application/json
app.use(express.urlencoded({ extended: true })); // Faz o parse do conteúdo tipo application/x-www-form-urlencoded

require("./routes/routes.js")(app);

const books = [
    {
        name: "wook",
        address: "https://www.wook.pt/destaques/pre-lancamentos/00/00/11379",
        base: "https://www.wook.pt",
        handler: function (res) {
            const booksAddress = this.address;
            const booksBase = this.base;
            const library = this.name;

            axios.get(booksAddress)
                .then((response) => {
                    const html = response.data;
                    const $ = cheerio.load(html);
                    const specificArticles = [];

                    $("div[data-product-id]", html).each(function () {
                        const title = $(this).attr("data-product-name");
                        const price = $("div.price > span", this).first().text().trim();
                        const oldPrice = $("div.price > span.price-undercut", this).text().trim();
                        const url = $("a.track", this).attr("href");
                        const urlImage = $("img", this).first().attr("src").split('/').slice(0,-1).join('/');
                        specificArticles.push({
                            title,
                            price,
                            oldPrice,
                            url: booksBase + url,
                            source: library,
                            urlImage
                        });
                    });

                    res.json(specificArticles);
                })
                .catch((err) => console.log(err));
        },
    },
    {
        name: "bertrand",
        address: "https://www.bertrand.pt/destaques/pre-lancamentos/00/00/9933",
        base: "https://www.bertrand.pt",
        handler: function (res) {
            const booksAddress = this.address;
            const booksBase = this.base;
            const library = this.name;

            axios.get(booksAddress)
                .then((response) => {
                    const html = response.data;
                    const $ = cheerio.load(html);
                    const specificArticles = [];

                    $("div[data-product-id]", html).each(function () {
                        const title = $(this).attr("data-product-name");
                        const price = $("div.price > span", this).first().text();
                        const url = $("a.track", this).attr("href");
                        const urlImage = $("img", this).first().attr("src").split('/').slice(0,-1).join('/');
                        specificArticles.push({
                            title,
                            price,
                            url: booksBase + url,
                            source: library,
                            urlImage
                        });
                    });

                    res.json(specificArticles);
                })
                .catch((err) => console.log(err));
        },
    },
    {
        name: "amazon",
        address: "https://www.amazon.es/-/pt/gp/new-releases/books/",
        base: "https://www.amazon.es",
        handler: function (res) {
            const booksAddress = this.address;
            const booksBase = this.base;
            const library = this.name;
                
            axios
                .get(booksAddress)
                .then((response) => {
                    const html = response.data;
                    const $ = cheerio.load(html);
                    const specificArticles = [];

                    $('li.zg-item-immersion', html).each(function () {
                        const title = $('div.p13n-sc-truncate.p13n-sc-line-clamp-1', this).text().trim();
                        const url = $('a.a-link-normal', this).attr("href");
                        const price = $("span.p13n-sc-price", this).text();
                        const urlImage = $("img", this).first().attr("src");
                        specificArticles.push({
                            title,
                            price,
                            url: booksBase + url,
                            source: library,
                            urlImage
                        });
                    });
                    res.json(specificArticles);
                })
                .catch((err) => console.log(err));
        },
    },
];

const articles = [];

books.forEach((newspaper) => {
    articles.push(newspaper.name);
});

app.get("/libraries", (req, res) => {
    res.json(articles);
});

app.get("/libraries/:library", (req, res) => {
    const library = req.params.library;
    const newspaper = books.filter(
        (newspaper) => newspaper.name == library)[0];

    newspaper.handler(res);
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
});

app.use(express.static('public'));