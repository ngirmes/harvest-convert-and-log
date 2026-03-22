export default function validate(schema, source = "body") {
  console.log("validating");
  return (req, res, next) => {
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
