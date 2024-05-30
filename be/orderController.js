import AuthService from '../auth-service.js';
import ZaloService from '../zalo-service.js';
import User from "../models/user";
import Orders from "../models/order"


//tìm đơn hàng 
router.get('/history', async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const orders = await Orders.find({ user: userId }).sort({ createdAt: -1 });
    res.send({ error: 0, message: 'Success', data: orders });
  } catch (error) {
    res.send({ error: -1, message: 'Unknown exception' });
    console.log('API-Exception', error);
  }
});
// order cod
router.post('/checkout', async (req, res) => {
  try {
    const { _id: userId, followerId } = req.user;
    const { cart = [], selectedDiscount, shipping, shop, address, shippingTime, note } = req.body;
    const total = cart.reduce((total, item) => total + item.subtotal, 0);
    const doc = await Orders.create({ user: userId, cart, selectedDiscount, total, shipping, shop, address, shippingTime, note });
    const detail = cart.map(item => `${item.quantity}x ${item.product.name}`).join(', ');
    const response = await ZaloService.sendMessage(followerId, `Cảm ơn bạn đã đặt hàng tại Coffee Shop. Chi tiết đơn hàng: ${detail}. Tổng cộng: ${total} VND`);
    console.log('[OA Message]', response);
    res.send({ error: 0, message: 'Đặt hàng thành công!', data: doc });
  } catch (error) {
    res.send({ error: -1, message: 'Unknown exception' });
    console.log('API-Exception', error);
  }
});
