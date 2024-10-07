const path = require("path");
const express = require("express");
const axios = require("axios");
const PushNotifications = require('@pusher/push-notifications-server');

// create express app
const app = express();

// set view path
app.set('views', path.join(__dirname, 'views'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// set up beams client
const beamsClient = new PushNotifications({
  instanceId: process.env.BEAMS_INSTANCE_ID,
  secretKey: process.env.BEAMS_SECRET_KEY,
});

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

// get sass comment
const getComment = () => {
  const comments = [
    'have they tried turning it off and on again?',
    'Cool, I\'ll just teleport to my destination instead.',
    'District line distruption? That never happens?'
  ]

  return comments[Math.floor(Math.random() * comments.length)];
}

// get the district line status
const getStatus = async (attempt = 1) => {
  if (attempt > 10) {
    return Error('too many attempts to tfl api');
  }

  const config = {
    method: 'GET',
    url: `${process.env.TFL_API_URL}/Line/district/status`,
    headers: {
      'app_key': process.env.TFL_API_TOKEN,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  const resp = await axios.request(config);
  console.log(resp.headers['content-type']);

  if (resp.headers['content-type'].includes('text/xml')) {
    return getStatus(attempt + 1);
  }

  if (resp.data.lenth === 0) {
    throw Error('unable to get tfl status');
  }

  const district = resp.data[0];
  const distruptions = [];

  if (!district.lineStatuses) {
    throw Error('incorrect tfl api response');
  }

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
  } catch (error) {
    res.status(500).send("something went wrong");
  }
});

app.get('/reason', async (req, res) => {
  try {
    const distruptions = await getStatus();
    const date = getCurrentDate();
    res.render('reason', { distruptions, date });
  } catch (error) {
    res.status(500).send("something went wrong");
  }
});

app.get('/about', async (req, res) => {
  res.render('about');
});

app.get('/_notify', async (req, res) => {
  try {
    const distruptions = await getStatus();
    const status = distruptions.length > 0 ? 'uh oh! the district line is currently f--ked!' : 'wow! suprisingly the district line is okay!'

    const resp = await beamsClient.publishToInterests(['district-line'], {
      web: {
        notification: {
          title: 'is the district line f--ked?',
          body: status
        }
      }
    });
    const id = await resp.publishId;
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: 'something went wrong' });
  }
});

module.exports = app;
