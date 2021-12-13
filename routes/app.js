const PORT = process.env.PORT || 9000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const { get } = require("cheerio/lib/api/traversing");
const { contains } = require("cheerio/lib/static");

const app = express();

const books = [
    {
        name: "wook",
        address: "https://www.wook.pt/destaques/pre-lancamentos/00/00/11379",
        base: "https://www.wook.pt",
        handler: function (res) {
            const booksAddress = this.address;
            const booksBase = this.base;
            const bookrId = this.name;

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
                        specificArticles.push({
                            title,
                            price,
                            oldPrice,
                            url: booksBase + url,
                            source: bookrId,
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
            const bookrId = this.name;

            axios.get(booksAddress)
                .then((response) => {
                    const html = response.data;
                    const $ = cheerio.load(html);
                    const specificArticles = [];

                    $("div[data-product-id]", html).each(function () {
                        const title = $(this).attr("data-product-name");
                        const price = $("div.price > span", this).first().text();
                        const url = $("a.track", this).attr("href");
                        specificArticles.push({
                            title,
                            price,
                            url: booksBase + url,
                            source: bookrId,
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
            const bookrId = this.name;
                
            axios
                .get(booksAddress)
                .then((response) => {
                    const html = response.data;
                    const $ = cheerio.load(html);
                    const specificArticles = [];

                    $('li.zg-item-immersion', html).each(function () {
                        title = $('div.p13n-sc-truncate.p13n-sc-line-clamp-1', this).text().trim();
                        url = $('a.a-link-normal', this).attr("href");
                        price = $("span.p13n-sc-price", this).text();
                        specificArticles.push({
                            title,
                            price,
                            url: booksBase + url,
                            source: bookrId,
                        });
                    });
                    res.json(specificArticles);
                })
                .catch((err) => console.log(err));
        },
    },
    // {
    //     name: "sibila",
    //     address:"https://loja.sibila.pt/epages/960852226.sf/pt_PT/?ObjectPath=/Shops/960852226/Categories/Novidades",
    //     base: "https://loja.sibila.pt/",
    //     handler: function (res) {
    //         const booksAddress = this.address;
    //         const booksBase = this.base;
    //         const bookrId = this.name;

    //         axios
    //             .get(booksAddress)
    //             .then((response) => {
    //                 const html = response.data;
    //                 const $ = cheerio.load(html);
    //                 const specificArticles = [];

    //                 console.log("HTML Sibila:");
    //                 console.log(html);
    //                 $("div.InfoArea", html).each(() => {
    //                     title = $("h3.TopPaddingWide > a", this).text();
    //                     url = $("h3.TopPaddingWide > a", this).attr("href");
    //                     price = $("span.price-value > span[itemprop=price]", this).text();
    //                     //oldPrice = $('del.thumbnail-priceOld',this).text()
    //                     priceCurrency = $("span.price-value > span[itemprop=priceCurrency]",this).text();
    //                     specificArticles.push({
    //                         title,
    //                         price,
    //                         oldPrice,
    //                         url: booksBase + url,
    //                         source: bookrId,
    //                     });
    //                 });
    //                 res.json(specificArticles);
    //             })
    //             .catch((err) => {
    //                 console.log("Erro na Sibila:");
    //                 console.log(err);
    //             });
    //     },
    // },
];

const articles = [];

// books.forEach(newspaper => {
//     axios.get(newspaper.address)
//         .then(response => {
//             const html = response.data
//             const $ = cheerio.load(html)

//             $('a:contains("track")', html).each(function(){
//                 const title = $(this).text()
//                 const url = $(this).attr('href')

//                 articles.push({
//                     title,
//                     url: newspaper.base + url,
//                     source: newspaper.name
//                 })
//             })
//         })
// })

books.forEach((newspaper) => {
    articles.push(newspaper.name);
});

app.get("/", (req, res) => {
    res.json("Welcome to my API of the newest books    \
    /libraries/wook - Get the new releases from Wook\
    /libraries/bertrand - Get the new releases from Bertrand\
    /libraries/amazon - Get the new releases from amazon");
});

app.get("/libraries", (req, res) => {
    res.json(articles);
});

app.get("/libraries/:bookrId", (req, res) => {
    const bookrId = req.params.bookrId;
    const newspaper = books.filter(
        (newspaper) => newspaper.name == bookrId)[0];

    newspaper.handler(res);
});

app.listen(PORT, () => console.log(`server running on ${PORT}`));