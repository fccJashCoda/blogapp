const axios = require('axios');
const { slugify } = require('../utils/tools');

const arguments = process.argv.slice(2);

function timeControl(args) {
  const [spam, action] = args;

  if (spam < 2 || !action) return;
  console.log('Hold on to your butts...');

  let counter = 0;
  const spamming = setInterval(() => {
    ++counter;

    switch (action) {
      case 'create':
        spamDBcreatePost(counter);
        break;
      case 'update':
        spamDBupdatePost(counter);
        break;
      case 'test':
        console.log(counter);
        break;
      default:
        console.log('brrr');
        break;
    }

    if (counter === +spam) {
      console.log('trying to stop that thing');
      return clearInterval(spamming);
    }
  }, 2000);
}

function spamDBcreatePost(num) {
  const title = `Article ${num}`;

  const slug = slugify(title);
  axios
    .post('http://localhost:5000/api/blog', {
      author: 'admin',
      title,
      article:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet necessitatibus nihil provident accusamus earum modi tempora deserunt maiores deleniti quia!',
      snippet: 'Spam & eggs',
    })
    .then((res) => {
      if (res.status !== 200 || res.data.error) {
        console.log('nope');
        return;
      }
      axios
        .put(`http://localhost:5000/api/blog/${slug}/publish`)
        .then((response) => console.log('Post published'))
        .catch((err) => console.log("oh snap! stuff's on fire!"));
    })
    .catch((err) => console.log(err));
  return;
}

function spamDBupdatePost(num) {
  const author = 'admin';
  const title = `Article ${num}`;

  const article =
    'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet necessitatibus nihil provident accusamus earum modi tempora deserunt maiores deleniti quia!';
  const snippet = 'Spam & eggs';

  const slug = slugify(title);
  axios
    .put(`http://localhost:5000/api/blog/${slug}`, {
      author,
      title,
      article,
      snippet,
    })
    .then((res) => {
      console.log(res.data);

      if (res.status !== 200 || res.data.error) {
        console.log('nope');
        return;
      }
      console.log(`Updated: ${slug}`);
    })
    .catch((err) => console.log(err));
  return;
}

timeControl(arguments);
