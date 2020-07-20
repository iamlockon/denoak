import { RouterContext } from "../dep.ts";
export { startWorkers } from './worker.ts';
export const bodyParser = async (ctx: RouterContext) => {
  if (ctx.request.hasBody) {
    const { value } = await ctx.request.body(
      { contentTypes: { json: ["application/json"] } },
    );
    return value;
  }
  return {};
};

export const isValidationError = (error: any) => {
  return error instanceof ValidationError;
};

export const isDBError = (error: any) => {
  return error instanceof DBError;
};

export class ValidationError extends Error {
  status = 400;
  constructor(message: string) {
    super(`Bad Request: ${message}`);
  }
}

export class DBError extends Error {
  status = 500;
  constructor() {
    super("We encountered some problem...");
  }
}
