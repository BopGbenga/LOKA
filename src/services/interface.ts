import { User } from "../entities/users"; // Adjust this path as needed

declare global {
  namespace Express {
    interface Request {
      user?: User; // This ensures req.user is of type User
    }
  }
}
