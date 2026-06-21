# 🔐 Dynamic & Secure Key Management System

This system avoids over-relying on standard `.env` variables to eliminate the need for server restarts during **Key Rotation**. Instead, all sub-service and integration keys are managed dynamically within the database.

### 🛡️ Security Strategy (Encryption Over Plain-Text)
Storing sensitive tokens in plain-text is risky in production. To mitigate data exposure during potential database leaks, the system implements a secure cryptography architecture:

1. **Pre-Storage Encryption:** All sensitive keys are encrypted via `encryptKey()` using the **AES-256-GCM** authenticated encryption algorithm before being written to the database.
2. **Single Master Key Isolation:** The `.env` file only retains a single high-privilege variable—`DB_ENCRYPTION_KEY`—acting as the exclusive Master Key required to decrypt operational data at runtime.

---

### 🛠️ Core Architectural Files

#### 1. Database Gateway (`src/lib/auth/env.ts`)
Acts as the central access point to query and decrypt runtime secrets asynchronously from the database.

```typescript
export async function getDatabaseKeys(keyName: string): Promise<string> {
    const [row] = await db
        .select()
        .from(secretKeys)
        .where(eq(secretKeys.key, keyName))
        .limit(1)

    if (!row) {
        throw new Error(`Key for service "${keyName}" not found in database.`)
    }

    // Decrypt the value using the Master Key before exposing it to the application context
    return decryptKey(row.hash_value)
}
```

#### 2. Cryptography Engine (`src/lib/auth/hash.ts`)
```typescript
// Uses a pre-buffered DB_ENCRYPTION_KEY for performance-first processing
export function encryptKey(text: string): string {
    const iv = randomBytes(IV_LENGTH)
    const cipher = createCipheriv(ALGORITHM, KEY, iv)
    const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
    
    return `${iv.toString('hex')}:${cipher.getAuthTag().toString('hex')}:${encrypted}`
}

export function decryptKey(encryptedData: string): string {
    const [ivHex, authTagHex, encryptedHex] = encryptedData.split(':')
    const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(ivHex, 'hex'))
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))

    return decipher.update(encryptedHex, 'hex', 'utf8') + decipher.final('utf8')
}
```