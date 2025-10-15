import GlobalDAO from "./GlobalDAO";
import { User, IUser } from "../models/User";

/**
 * Data Access Object (DAO) for users.
 *
 * This class extends the generic GlobalDAO to handle CRUD operations
 * for the User model.
 *
 * @extends GlobalDAO
 */
class UserDAO extends GlobalDAO<IUser> {
  /**
   * Creates an instance of UserDAO.
   * Passes the User model to the GlobalDAO constructor.
   */
  constructor() {
    super(User);
  }
}

export default new UserDAO();
