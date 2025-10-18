import GlobalController from "./GlobalController";
import UserDAO from "../dao/UserDAO";
import { IUser } from "../models/User";

/**
 * UserController - Handles CRUD operations for users.
 * Inherits generic methods from GlobalController.
 * @extends GlobalController<IUser>
 */
class UserController extends GlobalController<IUser> {
  /**
   * Creates an instance of UserController.
   */
  constructor() {
    super(UserDAO);
  }

  /**
   * Creates a new user after verifying the email is not already registered.
   * 
   * @async
   * @function create
   * @param {Object} req - Express request object containing the user data.
   * @param {Object} res - Express response object used to send the response.
   * @returns {Promise<void>} Sends a JSON response with a success or error message.
   */
  async create(req: any, res: any): Promise<void> {
    try {
      const { firstName, lastName, age, email, password } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !age || !email || !password) {
        res.status(400).json({
          message:
            "Todos los campos son obligatorios: firstName, lastName, age, email y password.",
        });
        return;
      }

      // Check if the email is already registered
      const existingUser = await (this.dao as any).findOne({ email });
      if (existingUser) {
        res.status(400).json({
          message: "Este correo ya está registrado. Intenta con otro.",
        });
        return;
      }

      // Create the new user
      const newUser = await this.dao.create(req.body);
      res.status(201).json({
        message: "Usuario registrado correctamente.",
        user: newUser,
      });
    } catch (error: any) {
      // Handle any errors during user creation
      res.status(400).json({
        message: `Error al registrar usuario: ${error.message}`,
      });
    }
  }
}

export default new UserController();
