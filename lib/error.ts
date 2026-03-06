type MongooseValidationError = {
  name: "ValidationError";
  errors: Record<string, { message: string }>;
};

type MongoDuplicateKeyError = {
  code: 11000;
  keyValue?: Record<string, unknown>;
};

type MongooseCastError = {
  name: "CastError";
};

type AppErrorShape = {
  status: number;
  message: string;
};

const isError = (err: unknown): err is Error => {
  return err instanceof Error;
};

const isValidationError = (err: unknown): err is MongooseValidationError => {
  return (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    err.name === "ValidationError" &&
    "errors" in err
  );
};

const isDuplicateKeyError = (err: unknown): err is MongoDuplicateKeyError => {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    err.code === 11000
  );
};

const isCastError = (err: unknown): err is MongooseCastError => {
  return (
    typeof err === "object" &&
    err !== null &&
    "name" in err &&
    err.name === "CastError"
  );
};

export function handleApiError(err: unknown): AppErrorShape {
  if (isCastError(err)) {
    return {
      status: 404,
      message: "Resource not found",
    };
  }

  if (isDuplicateKeyError(err)) {
    const duplicateField =
      err.keyValue && Object.keys(err.keyValue).length > 0
        ? Object.keys(err.keyValue)[0]
        : null;

    return {
      status: 400,
      message: duplicateField
        ? `${duplicateField} already exists`
        : "Duplicate field value entered",
    };
  }

  if (isValidationError(err)) {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");

    return {
      status: 400,
      message,
    };
  }

  if (isError(err)) {
    return {
      status: 500,
      message: err.message || "Server Error",
    };
  }

  return {
    status: 500,
    message: "Server Error",
  };
}