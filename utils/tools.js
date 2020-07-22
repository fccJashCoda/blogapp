exports.slugify = (str) => {
  const regex = /[^\w\s]/gi;
  return str.replace(regex, '').toLowerCase().split(' ').join('-');
};
