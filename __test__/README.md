# 🧪 Tests

| Location | Type | What it tests |
|---|---|---|
| `__test__/` | Integration | Whole system — real server, real WebSocket |
| `modules/<name>/__test__/` | Unit | Single functions — no server needed |

> 💡 **Rule:** testing a function? → `modules/__test__/` · testing the system? → `__test__/`

## 📁 Structure

```
__test__/                              # 🌐 Integration tests
└── broadcast.integration.test.ts

src/modules/<name>/
└── __test__/                          # ⚡ Unit tests
    ├── updateStatus.test.ts
    ├── getAllStatus.test.ts
    └── edgeCase.test.ts
```