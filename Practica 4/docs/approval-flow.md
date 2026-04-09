# Flujo de aprobacion de 3 pasos

```mermaid
stateDiagram-v2
  [*] --> PENDING_STEP_1
  PENDING_STEP_1 --> PENDING_STEP_2 : Approve step 1
  PENDING_STEP_2 --> PENDING_STEP_3 : Approve step 2
  PENDING_STEP_3 --> APPROVED : Approve step 3
  APPROVED --> [*]
```

## Reglas
- Solo puede aprobarse el paso actual.
- Si `step` recibido no coincide con `current_step`, se rechaza.
- En paso 3:
  - Se integra con sistema financiero externo.
  - Se notifica por correo a empleados de la planilla.
  - Se registra auditoria final.
