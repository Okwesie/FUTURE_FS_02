export function notFound(req, res, next) {
  res.status(404)
  next(new Error("Route not found"))
}

export function errorHandler(err, req, res, next) {
  const status = res.statusCode !== 200 ? res.statusCode : 500
  res.status(status).json({
    ok: false,
    error: {
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    },
  })
}
