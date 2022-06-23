import clientPromise from '../../lib/mongodb';
import Payment from '../../lib/models/payment';

export default async (req, res) => {
  await clientPromise();

  const { method } = req;

  switch (method) {
    case 'GET':
      res.status(200).json({ susses: true });
      break;
    case 'POST':
      const payment = await Payment.create({
        ...req.body,
      });
      await res
        .status(200)
        .json({ susses: true, RequestId: payment.id, amount: payment.amount });
      break;
  }
};
