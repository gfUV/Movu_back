import GlobalController from "./GlobalController";
import UserDAO from "../dao/UserDAO";
import { IUser } from "../models/User";

/**
 * UserController - Maneja las operaciones CRUD para usuarios.
 * Hereda los métodos genéricos de GlobalController.
 */
class UserController extends GlobalController<IUser> {
  constructor() {
    super(UserDAO);
  }

  /**
   * Crea un nuevo usuario verificando que el correo no esté registrado.
   */
  async create(req: any, res: any): Promise<void> {
    try {
      const { firstName, lastName, age, email, password } = req.body;

      // Validación de campos obligatorios
      if (!firstName || !lastName || !age || !email || !password) {
        res.status(400).json({
          message:
            "Todos los campos son obligatorios: firstName, lastName, age, email y password",
        });
        return;
      }

      // Verificar si el correo ya está registrado
      const existingUser = await (this.dao as any).findOne({ email });
      if (existingUser) {
        res.status(400).json({
          message: "Este correo ya está registrado. Intenta con otro.",
        });
        return;
      }

      // Crear el nuevo usuario
      const newUser = await this.dao.create(req.body);
      res.status(201).json({
        message: "Usuario registrado correctamente",
        user: newUser,
      });
    } catch (error: any) {
      res.status(400).json({
        message: `Error al registrar usuario: ${error.message}`,
      });
    }
  }
}

export default new UserController();
