const { Router } = require('express');

const router = Router();
router.get('/bookgeneral', getbookbyid);

module.exports = {
  productRouter: router,
};
