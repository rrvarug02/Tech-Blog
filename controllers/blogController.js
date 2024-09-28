const router = require('express').Router();
const { User, Post, Comment } = require('../models');

// Route for homepage
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, attributes: ['username'] }],
    });
    res.render('home', { posts: posts.map(post => post.get({ plain: true })), user: req.session.user_id });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for login/signup
router.get('/login', (req, res) => {
  res.render('login');
});

// Route for dashboard
router.get('/dashboard', async (req, res) => {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }
  try {
    const userPosts = await Post.findAll({ where: { user_id: req.session.user_id } });
    res.render('dashboard', { posts: userPosts.map(post => post.get({ plain: true })), user: req.session.user_id });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for individual post
router.get('/post/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['username'] }, { model: Comment, include: [User] }],
    });
    if (!post) {
      return res.status(404).render('404');
    }
    res.render('post', {
      post: post.get({ plain: true }),
      user: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for creating a new post
router.post('/api/posts', async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route for creating a comment
router.post('/api/comments', async (req, res) => {
  if (!req.session.user_id) {
    return res.status(401).json({ message: 'You must be logged in to comment.' });
  }
  try {
    const newComment = await Comment.create({
      content: req.body.content,
      post_id: req.body.post_id,
      user_id: req.session.user_id,
    });
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for deleting a post
router.delete('/api/posts/:id', async (req, res) => {
  try {
    const result = await Post.destroy({
      where: { id: req.params.id },
    });
    if (result) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for updating a post
router.put('/api/posts/:id', async (req, res) => {
  try {
    const updatedPost = await Post.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: { id: req.params.id },
      }
    );
    if (updatedPost[0]) {
      res.json({ message: 'Post updated successfully.' });
    } else {
      res.status(404).json({ message: 'Post not found.' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for signing up
router.post('/signup', async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      password: req.body.password,
    });
    req.session.user_id = newUser.id;
    res.json(newUser);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Route for logging in
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { username: req.body.username } });
    if (!userData || !userData.checkPassword(req.body.password)) {
      return res.status(400).json({ message: 'Incorrect username or password.' });
    }
    req.session.user_id = userData.id;
    res.json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route for logging out
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
