// TODO: Schemas are written here

export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "Username must be between 5-32 chars",
    },
    notEmpty: {
      errorMessage: "Username can't be empty",
    },
    isString: {
      errorMessage: "Username must be a String",
    },
  },
  displayName: {
    notEmpty: {
      errorMessage: "Display name can't be empty",
    },
  },
};

export const createQuerySchema = {
  filter: {
    isString: true,
    notEmpty: {
      errorMessage: "Filter value can't be empty",
    },
    isLength: {
      options: {
        min: 3,
        max: 10,
      },
      errorMessage: "Must be at least 3-10 chars",
    },
  },
};
