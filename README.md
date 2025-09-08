# cocos-challenge-backend

Backend del challenge con **Node.js + Express** y documentación **OpenAPI/Swagger** **Postman**.  
Incluye endpoints para **órdenes**, **portafolios** y **búsqueda de activos**, conexión a **PostgreSQL**, tests **unitarios**, **end-to-end** y una coleccion de postman para probar la API.

---

## Requisitos

- **Node.js** ≥ 18 LTS (recomendado)
- **npm** ≥ 9
- Cadena de conexión válida a Postgres en `DATABASE_URL`

---

## Instalación

```bash
git clone <url-del-repo>
cd challenge
npm i
```

---

## Configuración

Crea un archivo `.env` en la raíz del proyecto:

```dotenv
PORT=3000
NODE_ENV=dev
DATABASE_URL=postgres://<USER_NAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?sslmode=require
```

> **Nota:** si probas con una instancia local que no requiere SSL, elimina `?sslmode=require` o ajusta según tu entorno, pero con las credenciales tal cual fueron enviadas por email y el formato brindado en DATABASE_URL, la api se conecta sola.

---

## Ejecución

**Dev con generación de Swagger** (regenera la especificación y levanta el servicio):

```bash
npm run start:dev
```

**Dev sin regenerar Swagger** (solo levanta el servicio):

```bash
npm run dev
```

El servicio quedará disponible (por defecto) en:
`http://localhost:${PORT}` → `http://localhost:3000`

---

## Documentación de la API

Swagger UI: `http://localhost:3000/api-docs`

> La especificación se **regenera** automáticamente cuando usas `npm run start:dev`.

Postman collection

> Dentro de la carpeta ./docs se encuentran tanto la collection de postman para probar la api, como el enviroment de postman con la base url (port 3000)

---

## Scripts disponibles

| Script              | Descripción                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `npm run start:dev` | Genera/actualiza Swagger y arranca el servidor en modo desarrollo. |
| `npm run dev`       | Arranca el servidor en desarrollo **sin** regenerar Swagger.       |
| `npm run test:e2e`  | Ejecuta pruebas **end-to-end**, _requiere docker levantado_.       |
| `npm run test:unit` | Ejecuta pruebas **unitarias**.                                     |

---

## Pruebas

**Unitarias**

```bash
npm run test:unit
```

**End-to-end**

```bash
npm run test:e2e
```

Para las pruebas e2e se utilizo supertest y testcontainer, con lo cual se debe tener levantado docker para que automaticamente se cree la bd con los datos seeds

## Endpoints clave (resumen)

- **Portafolios**

  - `GET /api/portfolios/{user}` → Devuelve el portafolio del usuario.

- **Órdenes**

  - `POST /api/orders` → Crea una orden (BUY/SELL, MARKET/LIMIT) y devuelve el portafolio actualizado.

- **Activos**

  - `GET /api/assets/{asset}` → Busca por _ticker_ o _nombre_.
    Respuesta (conceptual):

    ```json
    {
      "data": [
        {
          "ticker": "PAMP",
          "name": "Pampa Holding S.A.",
          "currentPrice": "925.85"
        }
      ]
    }
    ```

> Los detalles completos de request/response están definidos en Swagger (`/api-docs`), con **schemas reutilizables** en `./docs/components.ts`.

---

## Comportamiento en producción

Si estableces `NODE_ENV=production`, la aplicación ajusta su comportamiento para entornos productivos (por ejemplo, respuestas de error **sin stack trace** y mensajes más escuetos).

---

## Solución de problemas

- **`DATABASE_URL` inválida o sin SSL:** verifica el formato y la necesidad de `sslmode=require`.
- **Swagger no muestra cambios:** usa `npm run start:dev` para regenerar la especificación.
- **No corren los test e2e:** recuerda tener arriba el deamon de docker (puede ser docker desktop)
