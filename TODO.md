# TODO — yae-backend rewrite ( from claude )

## API Design

| Item | Status |
|---|---|
| api-versioning (/v1/...) | Not started |
| standardized-error-response-shape | Not started |
| schema-validation-on-all-inputs (TypeBox) | Not started |
| separate-routing-validation-business-logic-layers | Not started |

## Security

| Item | Status |
|---|---|
| jwt-refresh-token-flow | Not started |
| rate-limit-per-endpoint-sensitivity | Not started |
| cors-trusted-origin-source-audit | Not started |
| secrets-doppler-coverage-all-envs | Not started |

## Data Layer

| Item | Status |
|---|---|
| transaction-wrapping-for-multi-write-ops | Not started |
| connection-pooling-for-persistent-process | Not started |
| migration-strategy-drizzle | Not started |

## Observability

| Item | Status |
|---|---|
| structured-json-logging | Not started |
| request-id-tracing | Not started |
| health-check-endpoint | Not started |
| error-tracking-sentry | Not started |

## Testing

| Item | Status |
|---|---|
| unit-tests-business-logic | Not started |
| integration-tests-api-endpoints | Not started |
| ci-block-merge-on-test-failure | Not started |

## Documentation

| Item | Status |
|---|---|
| openapi-spec-from-elysia-schema | Not started |
| per-module-readme-design-rationale | Not started |

## Deployment / Infra

| Item | Status |
|---|---|
| graceful-shutdown-db-redis | Not started |
| dev-staging-prod-parity | Not started |

## Inter-service Communication

| Item | Status |
|---|---|
| retry-with-backoff-for-service-calls | Not started |
| circuit-breaker-for-downstream-failures | Not started |
| idempotency-keys-for-mutating-requests | Not started |
| timeout-config-per-external-call | Not started |

## Performance

| Item | Status |
|---|---|
| n-plus-one-query-prevention | Not started |
| response-caching-strategy | Not started |
| database-indexing-audit | Not started |
| pagination-on-list-endpoints | Not started |

## Config & Environment

| Item | Status |
|---|---|
| env-var-validation-on-boot | Not started |
| feature-flags-for-gradual-rollout | Not started |

## Reliability

| Item | Status |
|---|---|
| idempotent-migrations | Not started |
| backup-restore-strategy-for-db | Not started |
| load-testing-before-cutover | Not started |

## Security (Additional)

| Item | Status |
|---|---|
| input-sanitization-against-injection | Not started |
| audit-log-for-sensitive-actions | Not started |
| secret-rotation-automation | Not started |