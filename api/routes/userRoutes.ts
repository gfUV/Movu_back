import { Router, Request, Response } from "express";
import UserController from "../controllers/UserController";

/**
 * User Routes
 *
 * Provides CRUD operations for users.
 *
 * @module api/routes/userRoutes
 */

const router: Router = Router();

/**
 * GET /users
 *
 * Retrieve all users.
 */
router.get("/", (req: Request, res: Response) =>
  UserController.getAll(req, res)
);

/**
 * GET /users/:id
 *
 * Retrieve a single user by ID.
 */
router.get("/:id", (req: Request, res: Response) =>
  UserController.read(req, res)
);

/**
 * POST /users
 *
 * Create a new user.
 */
router.post("/", (req: Request, res: Response) =>
  UserController.create(req, res)
);

/**
 * PUT /users/:id
 *
 * Update an existing user by ID.
 */
router.put("/:id", (req: Request, res: Response) =>
  UserController.update(req, res)
);

/**
 * DELETE /users/:id
 *
 * Delete a user by ID.
 */
router.delete("/:id", (req: Request, res: Response) =>
  UserController.delete(req, res)
);

export default router;
