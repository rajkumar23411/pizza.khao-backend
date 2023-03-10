const Product = require("../models/product");
const CustomErrorHandler = require("../middlewares/CustomErrorHandler");

const productController = {
  async create(req, res, next) {
    try {
      const { name, price, oldPrice, description, category } = req.body;
      const product = await Product.create({
        name,
        price,
        oldPrice,
        description,
        category,
        user: req.user._id,
      });

      res.status(200).json({ product });
    } catch (Err) {
      console.log(Err);
    }
  },
  async update(req, res, next) {
    try {
      let product = await Product.findById(req.params.id);

      if (!product) {
        return next(CustomErrorHandler.notFound("Product not found"));
      }

      product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

      res.status(201).json({ message: "Product updated", product });
    } catch (error) {
      console.log(error);
    }
  },
  async getAllproducts(req, res, next) {
    try {
      const product = await Product.find();

      res.status(200).json({ product });
    } catch (error) {
      console.log(error);
    }
  },

  async getSingleProduct(req, res, next) {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(CustomErrorHandler.notFound("Product does not exists"));
      }

      res.status(200).json({ product });
    } catch (error) {
      console.log(error);
    }
  },

  async deleteAproduct(req, res, next) {
    try {
      let product = await Product.findById(req.params.id);

      if (!product) {
        return next(CustomErrorHandler.notFound("Product does not exists"));
      }

      await Product.findByIdAndRemove(req.params.id);

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.log(error);
    }
  },

  async addUpdateReview(req, res, next) {
    try {
      const { productId, comment, rating } = req.body;
      const name = `${req.user.firstname} ${req.user.lastname}`;
      const review = {
        user: req.user._id,
        name,
        rating: Number(rating),
        comment,
      };

      const product = await Product.findById(productId);

      if (!product) {
        return next(CustomErrorHandler.notFound("Product does not exists"));
      }

      const isReviewed = await product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user.toString() === req.user._id.toString()) {
            rev.rating = rating;
            rev.comment = comment;
          }
        });
      } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
      }

      let avg = 0;

      product.ratings = product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ runValidators: false });

      res.status(200).json({ message: "Review added successfully" });
    } catch (error) {
      console.log(error);
    }
  },
  async getAllReviews(req, res, next) {
    try {
      const product = await Product.findById(req.query.id);

      if (!product) {
        return next(CustomErrorHandler.notFound("Product not found"));
      }

      res.status(200).json(product.reviews);
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = productController;
