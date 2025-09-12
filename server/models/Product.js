import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    short: {
      type: String,
      required: true,
      maxlength: 500
    },
    full: {
      type: String,
      maxlength: 2000
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['Keychains', 'Flowers', 'Home Decor', 'Bags', 'Toys', 'Accessories', 'Custom']
  },
  subcategory: String,
  price: {
    regular: {
      type: Number,
      required: true,
      min: 0
    },
    sale: {
      type: Number,
      min: 0
    }
  },
  currency: {
    type: String,
    default: 'INR'
  },
  inventory: {
    availability: {
      type: String,
      enum: ['In Stock', 'Made to Order', 'Out of Stock'],
      default: 'Made to Order'
    },
    quantity: {
      type: Number,
      default: 0
    },
    lead_time: {
      type: String,
      default: '7-10 days'
    }
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  specifications: {
    materials: [String],
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, default: 'cm' }
    },
    weight: {
      value: Number,
      unit: { type: String, default: 'g' }
    },
    colors: [String],
    care_instructions: String
  },
  seo: {
    meta_title: String,
    meta_description: String,
    keywords: [String]
  },
  sku: {
    type: String,
    unique: true,
    required: true
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ featured: 1, isActive: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ 'price.regular': 1 });

// Generate slug from title
productSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

// Virtual for current price (sale or regular)
productSchema.virtual('currentPrice').get(function() {
  return this.price.sale && this.price.sale < this.price.regular 
    ? this.price.sale 
    : this.price.regular;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (this.price.sale && this.price.sale < this.price.regular) {
    return Math.round(((this.price.regular - this.price.sale) / this.price.regular) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Product', productSchema);