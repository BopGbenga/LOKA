import { Request, Response } from "express";
import { AppDataSource } from "../ormConfig";
import { Order } from "../entities/order";
import { OrderItem } from "../entities/orderItems";
import { products } from "../entities/products";
import { User } from "../entities/users";
import { Notification } from "../entities/notifications";
import { io } from "..";
import { sendOrderConfirmationEmail } from "../utils/notificationemail";

interface AuthRequest extends Request {
  user?: any;
}

export const createOrder = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user.id;
  const { products } = req.body;

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const orderRepository = AppDataSource.getRepository(Order);
    const order = new Order();
    order.user = user;
    order.status = "pending";
    order.totalPrice = 0;

    const orderItems: OrderItem[] = [];
    for (let item of products) {
      const productRepository = AppDataSource.getRepository(products);
      const product = await productRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        res
          .status(404)
          .json({ message: `Product with ID ${item.productId} not found` });
        return;
      }

      const orderItem = new OrderItem();
      orderItem.product = products;
      orderItem.quantity = item.quantity;
      orderItem.price = product.price * item.quantity;

      orderItems.push(orderItem);
      product.stock -= item.quantity;
      await productRepository.save(product);
    }

    order.totalPrice = orderItems.reduce(
      (total, item) => total + item.price,
      0
    );
    await orderRepository.save(order);

    for (let orderItem of orderItems) {
      orderItem.order = order;
      await AppDataSource.getRepository(OrderItem).save(orderItem);
    }

    // 🔹 Save notification in database
    const notificationRepository = AppDataSource.getRepository(Notification);
    const notification = new Notification();
    notification.user = user;
    notification.message = `Your order #${order.id} has been placed successfully.`;
    await notificationRepository.save(notification);

    // 🔹 Send Email Notification
    await sendOrderConfirmationEmail(user.email, order);

    // 🔹 Emit WebSocket Event
    io.emit(`notification-${user.id}`, {
      message: notification.message,
      orderId: order.id,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
