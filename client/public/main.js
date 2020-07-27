const likeBtn = document.querySelector('.likeBtn');
const likeCount = document.querySelector('.likeCount');

if (likeBtn) {
  likeBtn.addEventListener('click', () => {
    fetch(`${document.URL}/like`, {
      method: 'PUT',
      mode: 'cors',
    }).catch((err) => console.log(err));
  });
  // button.addEventListener('click', () => {
  //   const query = document.URL.replace('http://localhost:8000/', '');
  //   console.log(query);
  //   fetch(`http://localhost:5000/api/blog/${query}/like`, {
  //     method: 'PUT',
  //     mode: 'cors',
  //   })
  //     .then(() => {
  //       let regex = /\d+/g;
  //       let search = likeCount.textContent;
  //       let value = search.match(regex)[0];
  //       likeCount.textContent = likeCount.textContent.replace(
  //         value,
  //         +value + 1
  //       );
  //     })
  //     .catch((err) => console.log(err));
  // });
}

// features yet to be implemented
// right now, likes can be spammed
// make is so only users can like
//  -- need to implement authentication first
// make it so users can only like once
//  -- do this by adding an array of liked posts in the user model
//  -- create a function to check if the user already liked it and
//  -- disable the like button on the page if it is the case
// find a way to update the like counter in real time
