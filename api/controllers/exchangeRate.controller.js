const ExchangeRate = require("../../models/exchangeRate.model");
const cheerio = require("cheerio");
const request = require("request-promise");
const { response } = require("express");
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
            .split(" ")
            .slice(1, 23);

          const buyTransfers = $(el)
            .find("td.mua_1")
            .text()
            .replace(/\s+/g, " ")
            .split(" ")
            .slice(1, 23);

          const sellings = $(el)
            .find("td.ban_1")
            .text()
            .replace(/\s+/g, " ")
            .split(" ")
            .slice(1, 23);

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
      buyCash: row.buyCash?.replace(",", "").replace("-", 0),
      buyTransfer: row.buyTransfer?.replace(",", "").replace("-", 0),
      selling: row.selling?.replace(",", "").replace("-", 0),
    }));
  });
}

const update = async (req, res, next) => {
  const crawler = await doRequest(requests.URL);
  const data = formatDB(crawler);

  if (data[0].length === undefined) {
    console.log("Vui lòng kiểm tra kết nối mạng.");
  } else {
    const rows = data[0].map((row) => {
      return ExchangeRate.updateMany(
        { currency: row.currency },
        {
          currency: row.currency,
          buyCash: row.buyCash,
          buyTransfer: row.buyTransfer,
          selling: row.selling,
          updatedAt: Date.now(),
        }
      );
    });

    await asyncPool(1, rows, (doc) => doc.updateMany())
      .then(() => {
        console.log("Cập nhật thành công.");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

setInterval(update, 1000 * 60 * 3);

module.exports.list = async (req, res, next) => {
  await ExchangeRate.find()
    .where({ softDelete: "" })
    .sort({ createdAt: 1 })
    .limit(10)
    .exec((err, exchangeRates) => {
      if (err) return res.status(400).json(err);

      return res.status(200).json(exchangeRates.map(formatExchangeRate));
    });
};

function formatExchangeRate(exchangeRateFormDB) {
  const {
    _id: id,
    image,
    currency,
    buyCash,
    buyTransfer,
    selling,
    status,
  } = exchangeRateFormDB;

  return {
    id,
    image,
    currency,
    buyCash,
    buyTransfer,
    selling,
    status,
  };
}
