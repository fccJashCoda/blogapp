const likeBtn = document.querySelector('.likeBtn');
const likeCount = document.querySelector('.likeCount');

if (likeBtn) {
  likeBtn.addEventListener('click', () => {
    fetch(`${document.URL}/like`, {
      method: 'PUT',
      mode: 'cors',
    })
      .then(() => (window.location.href = window.location.href))
      .catch((err) => console.log(err));
  });
}
