const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { db } = require('../database/db');
const { cartRouter } = require('../routes/cart.routes');
const { categoryRouter } = require('../routes/category.routes');
const { productRouter } = require('../routes/product.routes');
const { userRouter } = require('../routes/user.routes');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    // ACA VA EL LIMITER

    this.paths = {
      user: '/api/v1/user',
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      cart: '/api/v1/cart',
    };
    this.database();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.app.use(helmet());
    this.app.use(xss());
    this.app.use(hpp());

    if (process.env.NODE_ENV === 'development') {
      console.log('HOLA ESTOY EN DESARROLLO');
    }
    if (process.env.NODE_ENV === 'production') {
      console.log('HOLA ESTOY EN PRODUCCIÓN');
    }

    // this.app.use('/api/v1',this.limiter)
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
  }
  routes() {
    this.app.use(this.paths.products, cartRouter);
    this.app.use(this.paths.products, categoryRouter);
    this.app.use(this.paths.products, productRouter);
    this.app.use(this.paths.products, userRouter);

    /* this.app.all('*', (req, res, next) => {
      return next(
        new AppError(`Can't find ${req.originalUrl} on this server`, 404)
      );
    }); 
    this.app.use(globalErrorHandler); */
  }
  database() {
    db.authenticate()
      .then(() => console.log('Database authenticated'))
      .catch(error => console.log(error));

    // relaciones

    db.sync()
      .then(() => consonle.log('Database synced'))
      .catch(error => console.log(error));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server in running on port`, this.port);
    });
  }
}

module.exports = Server;
