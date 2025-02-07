import nodemailer from "nodemailer";
import { Order } from "../entities/order";

export const sendOrderConfirmationEmail = async (email: string, order: Order) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Order Confirmation",
    html: `
      <h1>Order Confirmation</h1>
      <p>Thank you for your order! Here are the details:</p>
      <p>Order ID: ${order.id}</p>
      <p>Total Price: $${order.totalPrice}</p>
      <p>Status: ${order.status}</p>
      <p>We will notify you when your order status updates.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
