import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  cardnumber: {
    type: String,
  },
  amount: {
    type: Number,
  },
  cvv: {
    type: String,
  },
  expDate: {
    type: String,
  },
});
const Payment =
  mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

export default Payment;
