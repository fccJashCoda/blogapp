const moment = require('moment');

function timeSincePublished(timestamp) {
  if (timestamp >= Date.now() - 999) {
    return 'Just released';
  }
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 0 },
  ];
  const seconds = Math.floor((new Date() - timestamp) / 1000);
  const interval = intervals.find((i) => i.seconds < seconds);
  const count =
    interval.seconds > 0 ? Math.floor(seconds / interval.seconds) : seconds;
  return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
}

function humanReadableDate(timestamp) {
  return moment(Number(timestamp) ? new Date(+timestamp) : timestamp).format(
    'MMMM Do YYYY, h:mm:ss a'
  );
}

module.exports = {
  timeSincePublished,
  humanReadableDate,
};
