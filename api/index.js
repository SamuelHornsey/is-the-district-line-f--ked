const path = require("path");
const express = require("express");
const axios = require("axios");

// create express app
const app = express();

app.set('views', path.join(__dirname, 'views')); // Change 'templates' to your desired folder name

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// get the current date string
const getCurrentDate = () => {
  const date = new Date();

  const ordinalSuffix = (number) => {
    if (number >= 11 && number <= 13) return 'th';
    switch (number % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  const day = date.toLocaleString('en-gb', { weekday: 'long' });
  const dateSuffix = `${date.getDate()}${ordinalSuffix()}`;
  const month = date.toLocaleString('en-gb', { month: 'long' });
  const year = date.getFullYear();


  return `Today is ${day} the ${dateSuffix} of ${month} ${year}`;
}

const getComment = () => {
  const comments = [
    'have they tried turning it off and on again?',
    'Cool, I\'ll just teleport to my destination instead.',
    'District line distruption? That never happens?'
  ]

  return comments[Math.floor(Math.random() * comments.length)];
}

// get the district line status
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
  try {
    const distruptions = await getStatus();
    const date = getCurrentDate();
    const comment = getComment();
    res.render('index', { distruptions, date, comment });
  } catch {
    res.status(500).render("something went wrong");
  }
});

app.get('/reason', async (req, res) => {
  try {
    const distruptions = await getStatus();
    const date = getCurrentDate();
    res.render('reason', { distruptions, date });
  } catch {
    res.status(500).render("something went wrong");
  }
});

app.get('/about', async (req, res) => {
  res.render('about');
});

module.exports = app;
