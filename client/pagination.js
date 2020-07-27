const axios = require('axios');
const helper = require('./helper');
const listItems = [
  { title: 'Article 1', author: 'Bob' },
  { title: 'Article 2', author: 'Bob' },
  { title: 'Article 3', author: 'Bob' },
  { title: 'Article 4', author: 'Bob' },
  { title: 'Article 5', author: 'Bob' },
  { title: 'Article 6', author: 'Bob' },
  { title: 'Article 7', author: 'Bob' },
  { title: 'Article 8', author: 'Bob' },
  { title: 'Article 9', author: 'Bob' },
  { title: 'Article 10', author: 'Bob' },
  { title: 'Article 11', author: 'Bob' },
  { title: 'Article 12', author: 'Bob' },
  { title: 'Article 13', author: 'Bob' },
  { title: 'Article 14', author: 'Bob' },
  { title: 'Article 15', author: 'Bob' },
  { title: 'Article 16', author: 'Bob' },
  { title: 'Article 17', author: 'Bob' },
  { title: 'Article 18', author: 'Bob' },
  { title: 'Article 19', author: 'Bob' },
  { title: 'Article 20', author: 'Bob' },
  { title: 'Article 21', author: 'Bob' },
  { title: 'Article 22', author: 'Bob' },
];

const paginatedList = document.getElementById('paginatedList');

function paginate(blogs) {
  // console.log(list);
  displayList(blogs, currentPage + 4, perPage);
  displayButtons(blogs);
}

const currentPage = 1;
const perPage = 5;

function displayList(itemlist, page, numOfArticles) {
  paginatedList.innerHTML = '';

  page--;
  const start = numOfArticles * page;
  const end = start + numOfArticles;
  const displayItems = itemlist.slice(start, end);

  displayItems.forEach((blog) => {
    const div = document.createElement('div');
    div.innterHTML = _renderArticleTemplate(blog);
    paginatedList.appendChild(div);
  });
}

function _renderArticleTemplate(blog) {
  return `
    <a href="blog/${blog.slug}">
      <h3>${blog.title}</h3>
      <p>${blog.snippet}</p>
      <p>${blog.author}</p>
      <p>${helper.timeSincePublished(blog.publishedDate)}</p>
    </a>
  `;
}

function displayButtons(list) {
  const numOfButtons = Math.ceil(list.length / perPage);
  console.log(numOfButtons);
}
// displayList(listItems, currentPage + 4, perPage);
// displayButtons(listItems);
foo();

// prepare dom fields in the ejs files
// add the list articles to the dom
// review variable namimg
// add the buttons
// add event listeners to said buttons

module.exports = {
  paginate,
};
