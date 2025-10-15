import { Request, Response } from "express";

/**
 * Interface for a generic Data Access Object (DAO).
 * The DAO must implement basic CRUD methods.
 */
export interface IDao<T> {
  create(data: Partial<T>): Promise<T>;
  read(id: string): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
  getAll(filter?: Record<string, any>): Promise<T[]>;
}

/**
 * GlobalController
 *
 * A generic controller to handle CRUD operations.
 * It uses a Data Access Object (DAO) passed in the constructor to perform database actions.
 */
export default class GlobalController<T> {
  private dao: IDao<T>;

  /**
   * Creates an instance of GlobalController.
   * @param dao - Data Access Object with CRUD methods (create, read, update, delete, getAll).
   */
  constructor(dao: IDao<T>) {
    this.dao = dao;
  }

  /**
   * Create a new document.
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const document = await this.dao.create(req.body);
      res.status(201).json(document);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Read a document by ID.
   */
  async read(req: Request, res: Response): Promise<void> {
    try {
      const document = await this.dao.read(req.params.id);
      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }
      res.status(200).json(document);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * Update a document by ID.
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const document = await this.dao.update(req.params.id, req.body);
      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }
      res.status(200).json(document);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Delete a document by ID.
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const document = await this.dao.delete(req.params.id);
      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }
      res.status(200).json(document);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * Get all documents with optional query filters.
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filter = req.query || {};
      const documents = await this.dao.getAll(filter);
      res.status(200).json(documents);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
