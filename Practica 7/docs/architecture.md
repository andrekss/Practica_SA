# Diagrama de Arquitectura General

```mermaid
flowchart LR
  UI[Frontend React] --> GW[API Gateway Nest]
  GW --> OAUTH[OAuth Corporativo / Mock]
  GW --> AUTHZ[AuthZ Service]
  GW --> PAY[Payroll Service]
  GW --> AUD[Audit Service]

  PAY --> MINIO[(MinIO - CSV Storage)]
  PAY --> FIN[Financial External System / Mock]
  PAY --> NOTI[Notification Service]
  PAY --> AUD

  NOTI --> SMTP[MailHog SMTP]

  AUTHZ --> DB1[(Postgres AuthZ)]
  PAY --> DB2[(Postgres Payroll)]
  NOTI --> DB3[(Postgres Notification)]
  AUD --> DB4[(Postgres Audit)]
```

## Comunicacion entre servicios
- Cliente -> Gateway: REST.
- Gateway -> AuthZ/Payroll/Audit: REST.
- Payroll -> Notification/Finance/Audit: REST.

## Justificacion
- Desacopla modulos de negocio criticos.
- Escalamiento independiente por servicio.
- Reduce impacto de picos de carga en procesos de planillas.
