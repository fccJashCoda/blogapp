const axios = require('axios');
const { slugify } = require('../utils/tools');

// axios
//   .get('http://localhost:5000/api/blog')
//   .then(({ data }) => console.log(data));

// axios
//   .get('http://localhost:5000/api/blog')
//   .then(({ data }) => console.log(data));

// /5f0a246e0881c42bc4ab32f5

// function slugify(str) {
//   const regex = /[^\w\s]/gi;
//   return str.replace(regex, '').toLowerCase().split(' ').join('-');
// }
// const helper = require('../utils/tools');
// console.log(
//   helper.slugify(
//     'This is a test string, 55757 with lots of: punctuations; in it?!.'
//   )
// );

// function timeSincePublished(timestamp) {
//   if (timestamp >= Date.now() - 999) {
//     return 'Just released';
//   }
//   const intervals = [
//     { label: 'year', seconds: 31536000 },
//     { label: 'month', seconds: 2592000 },
//     { label: 'day', seconds: 86400 },
//     { label: 'hour', seconds: 3600 },
//     { label: 'minute', seconds: 60 },
//     { label: 'second', seconds: 0 },
//   ];
//   const seconds = Math.floor((new Date() - timestamp) / 1000);
//   const interval = intervals.find((i) => i.seconds < seconds);
//   const count =
//     interval.seconds > 0 ? Math.floor(seconds / interval.seconds) : seconds;
//   return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
// }

// console.log(timeSincePublished(1594851689097));
// console.log(timeSincePublished(Date.now() - 999));
// console.log(timeSincePublished(Date.now() - 1000));

// populate db
const arguments = process.argv.slice(2);
console.log(arguments);
function foo(args) {
  const arguments = args.slice(2);
  console.log(arguments);
}
foo(process.argv, 1, 2, 3, 4, 5);
