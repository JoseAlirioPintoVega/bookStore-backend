const { Router } = require('express');

const router = Router();

router.post('/signup', createUser);

module.exports = {
  userRouter: router,
};
