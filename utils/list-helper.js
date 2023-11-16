const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const likesReducer = (sum, likes) => {
    return sum + likes.likes;
  };

  return blogs.length === 0 ? 0 : blogs.reduce(likesReducer, 0);
};

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null; // Return null for an empty array.
  }

  let maxLikes = -1;
  let maxLikedBlog = null;

  for (const blog of blogs) {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes;
      maxLikedBlog = blog;
    }
  }

  return maxLikedBlog;
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  let blogCount = {};
  let maxBlogAuthor = "";
  let maxBlogs = 0;

  for (const blog of blogs) {
    const author = blog.author;
    if (blogCount[author]) {
      blogCount[author]++;
    } else {
      blogCount[author] = 1;
    }

    if (blogCount[author] > maxBlogs) {
      maxBlogs = blogCount[author];
      maxBlogAuthor = author;
    }
  }

  return { author: maxBlogAuthor, blogs: maxBlogs };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  let likesByAuthor = {};
  let maxBlogAuthor = "";
  let maxLikes = 0;

  for (const blog of blogs) {
    const author = blog.author;
    const likes = blog.likes;

    if (likesByAuthor[author]) {
      likesByAuthor[author] += likes;
    } else {
      likesByAuthor[author] = likes;
    }

    if (likesByAuthor[author] > maxLikes) {
      maxLikes = likesByAuthor[author];
      maxBlogAuthor = author;
    }
  }

  return { author: maxBlogAuthor, likes: maxLikes };
};

module.exports = {
  dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
};