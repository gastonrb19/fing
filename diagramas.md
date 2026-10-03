# 📖 Documentación de Arquitectura Completa: Universo FING

Este documento contiene la arquitectura técnica global, diagramas relacionales y de secuencia que cubren absolutamente todos los módulos operativos del backend de la aplicación.

---

## 1. 📊 Diagrama de Entidad Relación (ERD) Global

Representación integral de la Base de Datos.

```mermaid
erDiagram
    USERS {
        int id PK
        string username
        string email
        string hashedPassword
        string phone
    }
    CATEGORY {
        int id PK
        string name
        string description
    }
    SUBCATEGORY {
        int id PK
        int categoryId FK
        string name
        string description
    }
    TYPESPEND {
        int id PK
        string name "Ej: Ingreso, Gasto"
    }
    FRIENDREQUEST {
        int id PK
        int senderId FK "Usuario Origen"
        int receiverId FK "Usuario Destino"
        string status "PENDING, ACCEPTED, REJECTED"
    }
    FRIENDSHIP {
        int id PK
        int userId FK "Usuario A"
        int friendId FK "Usuario B"
    }
    SPEND {
        int id PK
        int userId FK "Creador Original"
        int subcategoryId FK
        int typeId FK
        float amount
        int totalInstallment
    }
    PLANNEDINSTALLMENT {
        string idPI PK
        int spendId FK
        float amount "Monto de la cuota mensual"
        date availableDate
    }
    INSTALLMENTUSERPAYMENT {
        uuid idPayment PK
        string plannedInstallmentId FK
        int userId FK "Deudor asignado"
        int assumedByUserId FK "Salvador"
        float assignedAmount
        float paidAmount
        boolean accepted
        boolean rejected
        boolean paymentDone
    }

    CATEGORY ||--|{ SUBCATEGORY : "agrupa"
    USERS ||--o{ FRIENDREQUEST : "envía/recibe"
    USERS ||--o{ FRIENDSHIP : "tiene"
    USERS ||--o{ SPEND : "crea"
    SUBCATEGORY ||--o{ SPEND : "clasifica"
    TYPESPEND ||--o{ SPEND : "define"
    SPEND ||--|{ PLANNEDINSTALLMENT : "se divide en"
    PLANNEDINSTALLMENT ||--|{ INSTALLMENTUSERPAYMENT : "exige pagos en"
    USERS ||--o{ INSTALLMENTUSERPAYMENT : "debe pagar"
    USERS ||--o{ INSTALLMENTUSERPAYMENT : "termina asumiendo"
```

---

## 2. 🔄 Universo de Flujos (Diagramas de Secuencia)

A continuación, el ecosistema completo de operaciones que puede realizar la app.

### Flujo 1: Carga de Catálogos (UI Setup)
Cuando el usuario abre el formulario para cargar un gasto, el Frontend necesita armar los "Combobox" (Selects).
```mermaid
sequenceDiagram
    actor App as Frontend
    participant API as Category Controller
    participant BD as Base de Datos

    App->>API: GET /api/categories
    API->>BD: SELECT * FROM CATEGORY
    BD-->>API: Lista de Categorías
    API-->>App: 200 OK (Array JSON)
    
    App->>API: GET /api/subcategories
    API->>BD: SELECT * FROM SUBCATEGORY JOIN CATEGORY
    BD-->>API: Lista de Subcategorías (Anidadas)
    API-->>App: 200 OK (Array JSON)
```

### Flujo 2: Sistema Social (Amistades Bidireccionales)
El proceso para poder dividir cuentas requiere conectar cuentas primero.
```mermaid
sequenceDiagram
    actor A as Usuario A
    actor B as Usuario B
    participant API as Request Controller
    participant BD as Base de Datos

    A->>API: POST /friend-requests (receiverId: B)
    API->>BD: Valida (B existe, no son amigos, no hay pending)
    API->>BD: INSERT FRIENDREQUEST (Status: PENDING)
    API-->>A: 201 Created

    B->>API: GET /users/B/friend-requests
    API-->>B: Retorna solicitud de A

    B->>API: PUT /friend-requests/{id}/respond (ACCEPTED)
    API->>BD: TRANSACTION START
    BD->>BD: UPDATE FRIENDREQUEST (Status: ACCEPTED)
    BD->>BD: INSERT FRIENDSHIP (userId: A, friendId: B)
    BD->>BD: INSERT FRIENDSHIP (userId: B, friendId: A)
    API-->>B: 200 OK
```

### Flujo 3: Motor Transaccional de Gastos (Splitwise Mode)
El core financiero del sistema. Juan registra un almuerzo de $1000 dividido 60/40.
```mermaid
sequenceDiagram
    actor Juan as Creador (Juan)
    participant Zod as Middleware (Zod)
    participant API as Spend Controller
    participant BD as Base de Datos

    Juan->>Zod: POST /spends (Monto: $1000, 1 Cuota, Splits: 60% Juan, 40% Pedro)
    Zod->>Zod: Valida matemáticamente sum(%) == 100
    Zod->>API: Payload Válido
    API->>BD: TRANSACTION START
    BD->>BD: Verifica que Pedro es amigo de Juan en FRIENDSHIP
    BD->>BD: Crea SPEND (Monto: $1000, user: Juan)
    BD->>BD: Crea PLANNEDINSTALLMENT (Monto: $1000)
    BD->>BD: Crea PAYMENT (user: Juan, assignedAmount: $600)
    BD->>BD: Crea PAYMENT (user: Pedro, assignedAmount: $400)
    API-->>Juan: 201 Created
```

### Flujo 4: Dashboard de Deudas (Lectura Inteligente)
Cuando Pedro entra a su app, quiere ver "Cuánto dinero debe en total".
```mermaid
sequenceDiagram
    actor Pedro as Pedro (Deudor)
    participant API as Payment Controller
    participant BD as Base de Datos

    Pedro->>API: GET /users/Pedro/installmentuserpayments
    API->>BD: Query Inteligente: (userId=Pedro AND rejected=false AND assumedByUser=NULL) OR (assumedByUser=Pedro)
    BD-->>API: Retorna deudas activas de Pedro
    API-->>Pedro: 200 OK (Renderiza tarjetas de cobro)
```

### Flujo 5: Pago Exitoso de una Deuda
Pedro decide pagar su parte ($400) de la cuota asignada.
```mermaid
sequenceDiagram
    actor Pedro as Pedro
    participant API as Payment Controller
    participant BD as Base de Datos

    Pedro->>API: PUT /installmentuserpayments/{id} (paidAmount: 400, paymentDone: true)
    API->>BD: UPDATE INSTALLMENTUSERPAYMENT SET paidAmount = 400, paymentDone = true
    BD-->>API: Confirmación
    API-->>Pedro: 200 OK
```

### Flujo 6: Rechazo y Rebote Automático (Deuda Evadida)
Caso Borde: Pedro dice "Yo no pedí postre, no voy a pagar eso" y rechaza el cobro.
```mermaid
sequenceDiagram
    actor Pedro as Pedro
    participant API as Payment Controller
    participant BD as Base de Datos

    Pedro->>API: PUT /installmentuserpayments/{id}/reject
    API->>BD: TRANSACTION START
    API->>API: Valida seguridad (El payment es de Pedro y no está pagado)
    BD->>BD: UPDATE PAYMENT SET rejected = true, assumedByUserId = ID_DE_JUAN (Creador original)
    API-->>Pedro: 200 OK (Pedro se libera de la deuda, Juan la absorbe)
```

### Flujo 7: Rescate Financiero (Pagar por un amigo)
Caso Borde Heroico: Juan dice "Pedro no tiene dinero hoy, yo asumo su deuda voluntariamente".
```mermaid
sequenceDiagram
    actor Juan as Juan (El Salvador)
    participant API as Payment Controller
    participant BD as Base de Datos

    Juan->>API: PUT /installmentuserpayments/{id_deuda_pedro}
    Note over Juan,API: Juan envía en el payload: assumedByUserId = Juan.ID, paymentDone = true
    API->>BD: UPDATE INSTALLMENTUSERPAYMENT SET assumedByUserId = Juan.ID, paymentDone = true
    API-->>Juan: 200 OK (La deuda de Pedro ahora consta como pagada y asumida por Juan)
```

---

## 3. 👤 Universo de Historias de Usuario

*   **HU-001 (Configuración):** Como *Usuario Administrador*, quiero poder dar de alta Categorías y Subcategorías para organizar estadísticamente el tipo de flujo financiero.
*   **HU-002 (Círculo Social):** Como *Usuario*, quiero poder enviar solicitudes de amistad mediante correo/ID a otras personas registradas, para formar un círculo de confianza financiera.
*   **HU-003 (Splits Equitativos):** Como *Creador de Gasto*, quiero registrar un ticket grande y dividir el peso financiero en porcentajes exactos con mi círculo social.
*   **HU-004 (Transparencia):** Como *Usuario Deudor*, quiero ver un Dashboard limpio que me muestre exactamente qué deudas están activas, ignorando las que ya rechacé, y resaltando las que mis amigos asumieron por mí.
*   **HU-005 (Libre Albedrío):** Como *Usuario Deudor*, quiero poder rechazar una asignación injusta, obligando a que la deuda rebote al creador sin corromper la integridad contable de la cuota mensual.
*   **HU-006 (Solidaridad):** Como *Usuario Salvador*, quiero tener la facultad de tomar la deuda de un amigo y marcarla como pagada asumiendo el rol en la base de datos, manteniendo un historial claro de los favores financieros.

---

## 4. 🧰 Casos de Uso del Ecosistema

1. **Catálogo:** Listar categorías con subcategorías anidadas. (Éxito).
2. **Seguridad API:** Intentar modificar o rechazar una cuota perteneciente a otro `userId` que no sea el propio. (Bloqueo `403 FORBIDDEN`).
3. **Validación Datos:** Intentar crear un gasto de 3 participantes sumando 90% en total. (Bloqueo en Middleware `400 BAD_REQUEST` Zod).
4. **Concurrencia Social:** Intentar enviar una amistad a alguien con quien ya hay un registro PENDING en estado inverso. (Bloqueo de Servicio `400 BAD_REQUEST`).
