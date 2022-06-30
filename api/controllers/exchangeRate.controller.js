const ExchangeRate = require("../../models/exchangeRate.model");
const cheerio = require("cheerio");
const request = require("request-promise");
const { response } = require("express");
const fs = require("fs");
const asyncPool = require("tiny-async-pool");
const requests = require("../../config/request.conf");

function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);

        const buyCash = [];
        const dataCrawler = [];

        $("#table").each((index, el) => {
          const buyCashs = $(el)
            .find("tr")
            .find(
              "td[style='text-align: center; vertical-align: middle; width: 26%']"
            )
            .text()
            .replace(/\s+/g, " ")
            .split(" ");

          for (var i = 1; i <= buyCashs.length; i += 3) {
            buyCash.push(buyCashs[i]);
          }
        });

        $("#contentInterestRates").each((index, el) => {
          const currencys = $(el)
            .find("td.ngoaite_1")
            .text()
            .replace(/\s+/g, " ")
            .split(" ");

          const buyTransfers = $(el)
            .find("td.mua_1")
            .text()
            .replace(/\s+/g, " ")
            .split(" ");

          const sellings = $(el)
            .find("td.ban_1")
            .text()
            .replace(/\s+/g, " ")
            .split(" ");

          const currency = currencys.map((currency) => {
            return currency;
          });

          const buyTransfer = buyTransfers.map((buyTransfer) => {
            return buyTransfer;
          });

          const selling = sellings.map((selling) => {
            return selling;
          });

          dataCrawler.push({ currency, buyCash, buyTransfer, selling });
        });

        resolve(dataCrawler);
      } else {
        reject(error);
      }
    });
  });
}

function formatDB(array) {
  return array.map((item) => {
    const arr = item.currency.map(
      (el, i) =>
        i === item.buyCash[i] || {
          currency: el,
          buyCash: item.buyCash[i],
          buyTransfer: item.buyTransfer[i],
          selling: item.selling[i],
        }
    );
    
    return arr.map((row) => ({
      currency: row.currency,
      buyCash: row.buyCash?.replace(",", ""),
      buyTransfer: row.buyTransfer?.replace(",", ""),
      selling: row.selling?.replace(",", ""),
    }));
  });
}

module.exports.create = async (req, res, next) => {
  const crawler = await doRequest(requests.URL);
  const data = formatDB(crawler);

  if (data[0].length < 0) {
    return res
      .status(400)
      .json({ message: "Kiếm tra lại kết nối của server." });
  } else {
    const x = data[0].forEach((el, i) => {
      return {
        image: "",
        currency: el.currency,
        buyCash: el.buyCash,
        buyTransfer: el.buyTransfer,
        selling: el.selling,
        createdAt: Date.now(),
      };
    });
  }
};
