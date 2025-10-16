import { Request, Response } from "express";
import GlobalController, { IDao } from "./GlobalController";
import UserDAO from "../dao/UserDAO";
import { IUser } from "../models/User";

/**
 * SessionController - Handles user session-related actions such as login.
 * Extends GlobalController to inherit generic CRUD operations.
 */
export default class SessionController extends GlobalController<IUser> {
  constructor() {
    super(UserDAO as IDao<IUser>);
  }

  /**
   * Authenticate a user based on email and password.
   *
   * @async
   * @function login
   * @param req - Express request object containing `email` and `password` in the body.
   * @param res - Express response object used to return success or error messages.
   * @returns Sends a success response with userId if login is valid, otherwise an error message.
   */
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email y contraseña son obligatorios" });
      return;
    }

    try {
      // Search for user by email using DAO
      const user = await (this.dao as any).findOne({ email });

      if (!user) {
        res.status(400).json({ error: "Usuario no encontrado" });
        return;
      }

      if (user.password !== password) {
        res.status(400).json({ error: "Contraseña incorrecta" });
        return;
      }

      res.status(200).json({ message: "Login correcto", userId: user.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error en el servidor" });
    }
  }
}
