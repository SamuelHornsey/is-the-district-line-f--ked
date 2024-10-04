const styles = require('./main.css');

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

window.addEventListener('load', () => {
  document.querySelector('.date').innerHTML = getCurrentDate();
});
