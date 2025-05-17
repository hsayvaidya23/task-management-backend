import { Request, Response } from 'express';
import userService from '../services/user.service';
import Joi from 'joi';

class UserController {
  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
      });

      const { error } = schema.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.details[0].message });
        return;
      }

      const user = await userService.createUser(req.body);
      const token = userService.generateToken(user);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new UserController();