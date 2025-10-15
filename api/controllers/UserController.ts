import GlobalController from "./GlobalController";
import UserDAO from "../dao/UserDAO";
import { IUser } from "../models/User";

/**
 * UserController - Handles CRUD operations for users.
 * Inherits all generic CRUD methods from GlobalController.
 *
 * @extends GlobalController
 */
class UserController extends GlobalController<IUser> {
  /**
   * Creates an instance of UserController.
   * Uses UserDAO to interact with the users collection in the database.
   */
  constructor() {
    super(UserDAO);
  }
}

export default new UserController();
