import User, { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';

export class UserService {
  // Create a new user
  async createUser(userData: { name: string; email: string; password: string }): Promise<IUser> {
    try {
      const user = new User(userData);
      await user.save();
      return user;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  }

  // Generate JWT token
  generateToken(user: IUser): string {
    const payload = {
      userId: user._id,
      email: user.email,
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    } as jwt.SignOptions);
  }

  // Find user by ID
  async getUserById(userId: string): Promise<IUser | null> {
    return User.findById(userId);
  }
}

export default new UserService();
