export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  console.error('Error stack:', err.stack);
  console.error('Request body:', req.body);

  // Determine status code based on error type
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.message.includes('required') || err.message.includes('must be')) {
    statusCode = 400; // Bad Request
  } else if (err.message.includes('API error') || err.message.includes('Deepseek')) {
    statusCode = 502; // Bad Gateway (API error)
  } else if (err.message.includes('Failed to communicate')) {
    statusCode = 503; // Service Unavailable
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack,
        details: err.toString()
      })
    }
  });
};

