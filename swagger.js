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
      title: "Brokerage API",
      version: "1.0.0",
      description: "Documentación de la API",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
  },
  apis: [
    path.resolve(__dirname, "./src/app/routes/*.routes.ts"),
    path.resolve(__dirname, "./src/app/routes/*.js"),
    path.resolve(__dirname, "./docs/*.ts"),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

const outputFile = path.resolve(__dirname, "./swagger-output.json");
fs.writeFileSync(outputFile, JSON.stringify(swaggerSpec, null, 2));

console.log("✅ swagger-output.json generated successfully.");

export default swaggerSpec;
