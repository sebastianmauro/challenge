// swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mi API de Express",
      version: "1.0.0",
      description: "Documentación de la API",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    components: {
      schemas: {
        Todo: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            title: {
              type: "string",
              example: "Aprender Swagger",
            },
            done: {
              type: "boolean",
              example: false,
            },
          },
        },
      },
    },
  },
  apis: [
    path.resolve(__dirname, "./src/app/routes/*.routes.ts"),
    path.resolve(__dirname, "./src/app/routes/*.js"),
  ],
};

// Generar la especificación
const swaggerSpec = swaggerJSDoc(options);

// Guardar en archivo JSON
const outputFile = path.resolve(__dirname, "./swagger-output.json");
fs.writeFileSync(outputFile, JSON.stringify(swaggerSpec, null, 2));

console.log("✅ swagger-output.json generado correctamente");

export default swaggerSpec;
