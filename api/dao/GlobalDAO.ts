import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";

/**
 * GlobalDAO - A generic Data Access Object to perform CRUD operations.
 * Works with any Mongoose model passed to the constructor.
 */
class GlobalDAO<T extends Document> {
  protected model: Model<T>;

  /**
   * Creates an instance of GlobalDAO.
   * @param model - The Mongoose model used for database operations.
   */
  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Create a new document in the collection.
   *
   * @param data - Data to create a new document.
   * @returns The created document.
   * @throws If document creation fails.
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error: any) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  /**
   * Read a document by its ID.
   *
   * @param id - The document ID.
   * @returns The document found.
   * @throws If no document is found or query fails.
   */
  async read(id: string): Promise<T> {
    try {
      const document = await this.model.findById(id);
      if (!document) throw new Error("Document not found");
      return document;
    } catch (error: any) {
      throw new Error(`Error getting document by ID: ${error.message}`);
    }
  }

  /**
   * Update a document by its ID.
   *
   * @param id - The document ID.
   * @param updateData - The data to update.
   * @returns The updated document.
   * @throws If no document is found or update fails.
   */
  async update(id: string, updateData: UpdateQuery<T>): Promise<T> {
    try {
      const updatedDocument = await this.model.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      if (!updatedDocument) throw new Error("Document not found");
      return updatedDocument;
    } catch (error: any) {
      throw new Error(`Error updating document: ${error.message}`);
    }
  }

  /**
   * Delete a document by its ID.
   *
   * @param id - The document ID.
   * @returns The deleted document.
   * @throws If no document is found or deletion fails.
   */
  async delete(id: string): Promise<T> {
    try {
      const deletedDocument = await this.model.findByIdAndDelete(id);
      if (!deletedDocument) throw new Error("Document not found");
      return deletedDocument;
    } catch (error: any) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
  }

  /**
   * Get all documents that match a filter.
   *
   * @param filter - Optional filter object.
   * @returns An array of matching documents.
   * @throws If fetching documents fails.
   */
  async getAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    try {
      return await this.model.find(filter);
    } catch (error: any) {
      throw new Error(`Error getting documents: ${error.message}`);
    }
  }

  /**
   * Find a single document that matches the query.
   *
   * @param query - MongoDB query object.
   * @returns The found document or null if none match.
   */
  async findOne(query: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(query);
  }
}

export default GlobalDAO;
