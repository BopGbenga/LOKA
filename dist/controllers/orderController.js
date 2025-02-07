"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = void 0;
const ormConfig_1 = require("../ormConfig");
const order_1 = require("../entities/order");
const orderItems_1 = require("../entities/orderItems");
const users_1 = require("../entities/users");
const notifications_1 = require("../entities/notifications");
const __1 = require("..");
const notificationemail_1 = require("../utils/notificationemail");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { products } = req.body;
    try {
        const userRepository = ormConfig_1.AppDataSource.getRepository(users_1.User);
        const user = yield userRepository.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const orderRepository = ormConfig_1.AppDataSource.getRepository(order_1.Order);
        const order = new order_1.Order();
        order.user = user;
        order.status = "pending";
        order.totalPrice = 0;
        const orderItems = [];
        for (let item of products) {
            const productRepository = ormConfig_1.AppDataSource.getRepository(products);
            const product = yield productRepository.findOne({
                where: { id: item.productId },
            });
            if (!product) {
                res
                    .status(404)
                    .json({ message: `Product with ID ${item.productId} not found` });
                return;
            }
            const orderItem = new orderItems_1.OrderItem();
            orderItem.product = products;
            orderItem.quantity = item.quantity;
            orderItem.price = product.price * item.quantity;
            orderItems.push(orderItem);
            product.stock -= item.quantity;
            yield productRepository.save(product);
        }
        order.totalPrice = orderItems.reduce((total, item) => total + item.price, 0);
        yield orderRepository.save(order);
        for (let orderItem of orderItems) {
            orderItem.order = order;
            yield ormConfig_1.AppDataSource.getRepository(orderItems_1.OrderItem).save(orderItem);
        }
        // 🔹 Save notification in database
        const notificationRepository = ormConfig_1.AppDataSource.getRepository(notifications_1.Notification);
        const notification = new notifications_1.Notification();
        notification.user = user;
        notification.message = `Your order #${order.id} has been placed successfully.`;
        yield notificationRepository.save(notification);
        // 🔹 Send Email Notification
        yield (0, notificationemail_1.sendOrderConfirmationEmail)(user.email, order);
        // 🔹 Emit WebSocket Event
        __1.io.emit(`notification-${user.id}`, {
            message: notification.message,
            orderId: order.id,
        });
        res.status(201).json(order);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createOrder = createOrder;
