# Fing - Arquitectura y Hoja de Ruta del Backend

Este documento detalla la estructura, flujo y evolución del **Backend Core** del proyecto "Fing". Está diseñado con diagramas de texto plano (ASCII/Unicode) para asegurar una visualización perfecta en cualquier editor o visor de Markdown.

## 🛠️ Stack Tecnológico del Backend
*   **Entorno de ejecución:** Node.js v20+ con TypeScript.
*   **Framework Web:** Express.js para la API REST y endpoints de Webhooks.
*   **ORM (Acceso a Datos):** TypeORM para gestionar esquemas, migraciones y consultas a PostgreSQL de forma segura.
*   **Bases de Datos:**
    *   **PostgreSQL (GCP Cloud SQL):** Persistencia de transacciones, cuentas, categorías y usuarios.
    *   **Redis (GCP Memorystore):** Gestión de sesiones temporales del bot (TTL) y estados conversacionales.
*   **IA e Integraciones:**
    *   **Gemini 1.5 Flash (Vertex AI):** Procesamiento multimodal de imágenes (OCR) y categorización automática.
    *   **WhatsApp Cloud API:** Endpoint de Webhook para recibir/enviar mensajes a los usuarios.

---

## 🗺️ Hoja de Ruta de Desarrollo - Backend

La evolución del servidor está dividida en las siguientes etapas críticas:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  v0.5: Base  ├─────>│  v1.5: VPC   ├─────>│ v2.0: Webhook├─────>│ v2.5: Redis  ├─────>│ v3.0: Gemini │
│ API/Postgres │      │  Seguridad   │      │ WhatsApp API │      │  y MCP Temp  │      │  Multimodal  │
└──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘      └──────────────┘
```

1.  **v0.5 (Base de Datos & API):** Configuración de Express, TypeORM y conexión inicial con PostgreSQL en la nube (Cloud SQL).
2.  **v1.5 (Aislamiento de Red):** Migración a conexiones internas mediante GCP Direct VPC Egress, cerrando todas las IPs públicas de las bases de datos para máxima seguridad.
3.  **v2.0 (Integración WhatsApp):** Implementación de la verificación del token de Meta y controlador (Controller) para procesar mensajes entrantes (Webhooks).
4.  **v2.5 (Gestión de Estado):** Conexión con Redis para almacenar el estado de la sesión (`ESPERANDO_CONFIRMACION`) y uso de TTL (Time-To-Live). Configuración inicial de servidores MCP.
5.  **v3.0 (Canal Inteligente Multimodal):** Integración del SDK de Gemini 1.5 Flash para extraer estructuradamente la información de los comprobantes y gatillar el flujo conversacional.

---

## 🔄 Flujo de Datos Interno del Backend (v3.0)

El siguiente flujo ilustra el ciclo de vida de una petición en el backend cuando se registra un gasto vía WhatsApp:

```
                      ┌──────────────────────────────────────────────┐
                      │    1. WhatsApp Cloud API (Evento Webhook)    │
                      └──────────────────────┬───────────────────────┘
                                             │ (Mensaje con Imagen)
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │          2. Controlador de Express           │
                      │  - Verifica firma y descarga archivo JPG     │
                      └──────────────────────┬───────────────────────┘
                                             │
                      ┌──────────────────────▼───────────────────────┐
                      │             3. Gestor de Contexto            │
                      │  - Consulta categorías del usuario en DB     │
                      │  - Construye JSON Schema dinámico para la IA │
                      └──────────────────────┬───────────────────────┘
                                             │
                      ┌──────────────────────▼───────────────────────┐
                      │          4. Conector de Gemini 1.5           │
                      │  - Envía comprobante + JSON Schema           │
                      │  - Recibe JSON estructurado con datos        │
                      └──────────────────────┬───────────────────────┘
                                             │
                      ┌──────────────────────▼───────────────────────┐
                      │           5. Controlador de Estado           │
                      │  - Guarda datos en Redis (TTL = 5 min)       │
                      │  - Envía mensaje de validación al usuario    │
                      └──────────────────────────────────────────────┘
```

---

## 🔒 Validación, Documentación y Reglas de Negocio (Nuevo Flujo)

### 1. Documentación Interactiva (OpenAPI / Swagger)
El backend ahora expone su especificación técnica completa a través de **Swagger UI**.
- **Acceso:** Levantando el servidor local y navegando a `http://localhost:8000/api-docs`.
- **Características:** Describe todos los endpoints, esquemas de DTOs y permite pruebas en vivo con ejemplos predefinidos.

### 2. Validación de Entradas (Zod)
Se ha integrado el middleware global `validateBody(schema)` para garantizar la integridad de los datos.
- Todo endpoint de creación (`POST`) o actualización (`PUT`) pasa por validación estricta de **Zod**.
- Si la petición falla, arroja un `GeneralError` (400 Bad Request) que es procesado uniformemente por el manejador global de excepciones (`dryfn`).

### 3. Flujo Transaccional de Gastos (Trigger Automático)
Al registrar un gasto/ingreso en `POST /spends`, el sistema activa un trigger de software:
1. Divide automáticamente el monto (`amount`) entre la cantidad de cuotas.
2. Inserta secuencialmente las cuotas en **`PLANNEDINSTALLMENT`** ajustando las fechas con seguridad de zona horaria (UTC).
3. Pre-crea en cascada los cobros pendientes en **`INSTALLMENTUSERPAYMENT`**, asignados directamente al usuario, listos para ser consultados y pagados.

---

## 📂 Repositorio de Código Fuente
*   **Código Backend Core:** [github.com/gastonrb19/fing](https://github.com/gastonrb19/fing)
