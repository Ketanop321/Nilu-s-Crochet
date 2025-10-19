import express from 'express';
import Product from '../models/Product.js';
import { auth as authenticate, authorize } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/products');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const parseJsonField = (value) => {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

const buildProductPayload = (data, { uploadedImages = [], title = '' } = {}) => {
  const payload = { ...data };

  // Parse potential JSON fields
  ['price', 'description', 'inventory', 'specifications', 'tags', 'images'].forEach((field) => {
    if (payload[field] !== undefined) {
      payload[field] = parseJsonField(payload[field]);
    }
  });

  // Ensure short description is set
  if (payload.shortDescription) {
    payload.description = {
      ...(typeof payload.description === 'object' ? payload.description : {}),
      short: payload.shortDescription
    };
    delete payload.shortDescription;
  }

  // Normalize inventory information
  if (payload.availability || payload.leadTime) {
    payload.inventory = {
      ...(typeof payload.inventory === 'object' ? payload.inventory : {}),
      availability: payload.availability || payload.inventory?.availability,
      lead_time: payload.leadTime || payload.inventory?.lead_time
    };
    delete payload.availability;
    delete payload.leadTime;
  }

  // Normalize price to object format
  if (typeof payload.price === 'number') {
    payload.price = { regular: payload.price };
  }
  if (typeof payload.price === 'string') {
    payload.price = { regular: Number(payload.price) };
  }

  // Normalize images
  let images = [];
  if (Array.isArray(payload.images)) {
    images = payload.images;
  }

  if (payload.imageUrl) {
    images = images.length
      ? images
      : [{ url: payload.imageUrl, alt: title || 'Product image', isPrimary: true }];
    delete payload.imageUrl;
  }

  if (uploadedImages.length > 0) {
    images = uploadedImages;
  } else if (images.length > 0) {
    images = images.map((img, index) => {
      if (typeof img === 'string') {
        return {
          url: img,
          alt: title || 'Product image',
          isPrimary: index === 0
        };
      }
      return {
        url: img.url,
        alt: img.alt || title || 'Product image',
        isPrimary: img.isPrimary ?? index === 0
      };
    });
  }

  if (images.length > 0) {
    payload.images = images;
  }

  // Normalize tags
  if (payload.tags && !Array.isArray(payload.tags)) {
    payload.tags = parseJsonField(payload.tags);
    if (!Array.isArray(payload.tags)) {
      payload.tags = [];
    }
  }

  return payload;
};

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured, sort, search } = req.query;
    
    // Build query
    const query = { isActive: true };
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'description.short': { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    let sortOption = {};
    if (sort === 'price_asc') sortOption = { 'price.regular': 1 };
    else if (sort === 'price_desc') sortOption = { 'price.regular': -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else sortOption = { featured: -1, createdAt: -1 };

    const products = await Product.find(query)
      .sort(sortOption)
      .select('-__v');

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get single product by ID or slug (public)
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Check if identifier is MongoDB ID or slug
    const query = identifier.match(/^[0-9a-fA-F]{24}$/) 
      ? { _id: identifier }
      : { slug: identifier };
    
    const product = await Product.findOne({ ...query, isActive: true })
      .select('-__v');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// Create new product (admin only)
router.post('/', authenticate, authorize('admin'), upload.array('images', 5), async (req, res) => {
  try {
    const uploadedImages = (req.files || []).map((file, index) => ({
      url: `/uploads/products/${file.filename}`,
      alt: req.body.title || 'Product image',
      isPrimary: index === 0
    }));

    const normalizedData = buildProductPayload(
      {
        ...req.body,
        createdBy: req.user._id
      },
      { uploadedImages, title: req.body.title }
    );

    if (!normalizedData.description || !normalizedData.description.short) {
      return res.status(400).json({
        success: false,
        message: 'Short description is required'
      });
    }

    if (!normalizedData.price || typeof normalizedData.price.regular !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Price is required'
      });
    }

    const product = new Product(normalizedData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      const fieldName = field === 'sku' ? 'SKU' : field;
      return res.status(409).json({
        success: false,
        message: `${fieldName} already exists`,
        error: `Duplicate ${fieldName.toLowerCase()}`
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// Update product (admin only)
router.put('/:id', authenticate, authorize('admin'), upload.array('images', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const uploadedImages = (req.files || []).map((file, index) => ({
      url: `/uploads/products/${file.filename}`,
      alt: req.body.title || existingProduct.title || 'Product image',
      isPrimary: false
    }));

    const normalizedData = buildProductPayload(
      {
        ...req.body
      },
      { uploadedImages, title: req.body.title || existingProduct.title }
    );

    if (uploadedImages.length > 0) {
      normalizedData.images = [
        ...(existingProduct.images || []),
        ...uploadedImages
      ];
    }

    const product = await Product.findByIdAndUpdate(
      id,
      normalizedData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      const fieldName = field === 'sku' ? 'SKU' : field;
      return res.status(409).json({
        success: false,
        message: `${fieldName} already exists`,
        error: `Duplicate ${fieldName.toLowerCase()}`
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Soft delete - just mark as inactive
    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

export default router;