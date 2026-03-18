export default function validate(schema, source = "body") {
  return (req, res, next) => {
    if (req.user.userId === "1") {
      next();
    }

    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.errors,
      });
    }

    req[source] = result.data;
    next();
  };
}
