import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productSnapshot: {
    title: String,
    price: Number,
    image: String,
    sku: String
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  customizations: {
    color: String,
    size: String,
    personalMessage: String,
    specialInstructions: String
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  guestCustomer: {
    name: String,
    email: String,
    phone: String
  },
  items: [orderItemSchema],
  pricing: {
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    landmark: String
  },
  billingAddress: {
    same: { type: Boolean, default: true },
    fullName: String,
    phone: String,
    email: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: String
  },
  payment: {
    method: {
      type: String,
      enum: ['COD', 'UPI', 'Card', 'NetBanking'],
      default: 'COD'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending'
    },
    transactionId: String,
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Pending'
  },
  tracking: {
    carrier: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  },
  timeline: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  notes: {
    customer: String,
    admin: String,
    internal: String
  },
  communication: [{
    type: { type: String, enum: ['Email', 'SMS', 'WhatsApp'] },
    status: { type: String, enum: ['Sent', 'Delivered', 'Failed'] },
    timestamp: { type: Date, default: Date.now },
    content: String
  }]
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'guestCustomer.email': 1 });

// Generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
    
    // Add initial timeline entry
    this.timeline.push({
      status: 'Order Placed',
      timestamp: new Date(),
      note: 'Order has been successfully placed'
    });
  }
  next();
});

// Calculate totals
orderSchema.methods.calculateTotals = function() {
  this.pricing.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.pricing.total = this.pricing.subtotal + this.pricing.tax + this.pricing.shipping - this.pricing.discount;
  return this;
};

// Add timeline entry
orderSchema.methods.addTimelineEntry = function(status, note, updatedBy) {
  this.timeline.push({
    status,
    note,
    updatedBy,
    timestamp: new Date()
  });
  return this;
};

export default mongoose.model('Order', orderSchema);