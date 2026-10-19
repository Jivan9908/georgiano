import "server-only";

export class DataAccessError extends Error {
  readonly code = "DATA_ACCESS_ERROR";

  constructor(readonly operation: string, options?: ErrorOptions) {
    super("The requested data operation could not be completed.", options);
    this.name = "DataAccessError";
  }
}

export async function executeDatabaseOperation<T>(operation: string, action: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error) {
    console.error(`[database:${operation}]`, error instanceof Error ? error.message : "Unknown database error");
    throw new DataAccessError(operation, { cause: error });
  }
}
