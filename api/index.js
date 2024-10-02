const path = require("path");
const express = require("express");
const axios = require("axios");

// create express app
const app = express();

app.set('views', path.join(__dirname, 'views')); // Change 'templates' to your desired folder name

// Set EJS as the templating engine
app.set('view engine', 'ejs');

const getStatus = async () => {
  const config = {
    method: 'GET',
    url: `${process.env.TFL_API_URL}/Line/district/status`,
    headers: {
      'app_key': process.env.TFL_API_TOKEN
    }
  }

  const resp = await axios.request(config);

  if (resp.data.lenth === 0) {
    throw Error('unable to get tfl status');
  }

  const district = resp.data[0];
  const distruptions = [];

  for (let status of district.lineStatuses) {
    if (status.statusSeverity < 10) {
      distruptions.push({
        status: status.statusSeverityDescription,
        reason: status.reason
      });
    }
  }

  return distruptions;
}

app.get('/', async (req, res) => {
  const distruptions = await getStatus();
  res.render('index', { distruptions });
});

module.exports = app;
