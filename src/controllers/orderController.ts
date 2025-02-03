import { Request, Response } from "express";
import { AppDataSource } from "../ormConfig";
import { Order } from "../entities/order";
import { OrderItem } from "../entities/orderItems";
import { products } from "../entities/products";
import { User } from "../entities/users";

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
    // Fetch the user from the database
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Create order
    const orderRepository = AppDataSource.getRepository(Order);
    const order = new Order();
    order.user = user;
    order.status = "pending"; // Default status
    order.totalPrice = 0; // Initialize total price

    // Create order items
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

      // Add orderItem to the array
      orderItems.push(orderItem);

      // Update the product's stock (assuming a stock field exists)
      product.stock -= item.quantity;
      await productRepository.save(product);
    }

    // Calculate the total price
    order.totalPrice = orderItems.reduce(
      (total, item) => total + item.price,
      0
    );
    await orderRepository.save(order);

    // Save the order items
    for (let orderItem of orderItems) {
      orderItem.order = order;
      await AppDataSource.getRepository(OrderItem).save(orderItem);
    }

    res.status(201).json(order); // Return the created order
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
