const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Hunting Portal API",
      version: "1.0.0",
      description: "API documentation for Job Hunting Portal backend",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],
  },
  apis: ["./routes/*.js"], // 👈 path of your routes
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
