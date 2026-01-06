# Frontend API Specification - Passcode & Certificate Management

## Base URL
```
/api
```

## Authentication
All endpoints require JWT Bearer token authentication:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## TypeScript Interfaces

### Response Types

```typescript
/**
 * Certificate status response from GET /user/certificate/status
 */
interface CertificateStatusDTO {
  /** Whether the employee has a certificate */
  hasCertificate: boolean;
  /** The certificate ID if one exists */
  certificateId?: number;
  /** Whether the certificate is active */
  isActive: boolean;
  /** Whether the certificate has expired */
  isExpired: boolean;
  /** Whether the certificate is expiring soon (within 5 days) */
  isExpiring: boolean;
  /** Number of days until certificate expires (0 if expired) */
  daysUntilExpiry: number;
  /** Certificate validity start date (ISO 8601 format) */
  validFrom?: string;
  /** Certificate validity end date (ISO 8601 format) */
  validUntil?: string;
  /** Informational message about the status */
  message: string;
}

/**
 * Success response for passcode operations
 */
interface PasscodeSuccessResponse {
  message: string;
}

/**
 * Error response format
 */
interface ErrorResponse {
  error: string;
}
```

---

## API Endpoints

### 1. Get Certificate Status

Check certificate expiry status for the current user. Use this to determine if warning banners or modals should be displayed.

```
GET /api/user/certificate/status
```

#### Response (200 OK) - Valid Certificate

```json
{
  "hasCertificate": true,
  "certificateId": 123,
  "isActive": true,
  "isExpired": false,
  "isExpiring": true,
  "daysUntilExpiry": 3,
  "validFrom": "2024-01-15T00:00:00",
  "validUntil": "2025-01-15T00:00:00",
  "message": "Certificate expires in 3 days"
}
```

#### Response (200 OK) - Certificate Expired

```json
{
  "hasCertificate": true,
  "certificateId": 123,
  "isActive": true,
  "isExpired": true,
  "isExpiring": false,
  "daysUntilExpiry": 0,
  "validFrom": "2023-01-15T00:00:00",
  "validUntil": "2024-01-15T00:00:00",
  "message": "Certificate has expired"
}
```

#### Response (200 OK) - No Certificate

```json
{
  "hasCertificate": false,
  "isExpired": true,
  "isExpiring": false,
  "daysUntilExpiry": 0,
  "message": "No valid certificate found"
}
```

#### Response (401 Unauthorized)

```json
{
  "error": "Not authenticated"
}
```

#### Response (500 Internal Server Error)

```json
{
  "error": "An unexpected error occurred while getting certificate status"
}
```

#### Example Usage

```typescript
const getCertificateStatus = async (): Promise<CertificateStatusDTO> => {
  const response = await fetch('/api/user/certificate/status', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};
```

---

### 2. Request Passcode Email (Forgot Passcode)

Send the existing passcode to the user's registered email address. Use this when the user has forgotten their passcode but their certificate is still valid.

```
POST /api/user/passcode
```

#### Request Body
None required.

#### Response (200 OK)

```json
{
  "message": "Passcode email has been sent"
}
```

#### Response (400 Bad Request) - No Email

```json
{
  "error": "No email configured for user"
}
```

#### Response (401 Unauthorized)

```json
{
  "error": "Not authenticated"
}
```

#### Response (500 Internal Server Error)

```json
{
  "error": "An unexpected error occurred while sending passcode email"
}
```

#### Example Usage

```typescript
const requestPasscodeEmail = async (): Promise<PasscodeSuccessResponse> => {
  const response = await fetch('/api/user/passcode', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};
```

---

### 3. Reset Passcode (Keep Certificate)

Generate a new passcode while keeping the existing certificate. Use this when the user wants to change their passcode but their certificate is still valid.

```
POST /api/user/passcode/reset
```

#### Request Body
None required.

#### Response (200 OK)

```json
{
  "message": "Passcode has been reset and sent to your email"
}
```

#### Response (400 Bad Request) - No Email

```json
{
  "error": "No email configured for user"
}
```

#### Response (401 Unauthorized)

```json
{
  "error": "Not authenticated"
}
```

#### Response (404 Not Found)

```json
{
  "error": "No valid certificate found"
}
```

#### Response (500 Internal Server Error)

```json
{
  "error": "An unexpected error occurred while resetting passcode"
}
```

#### Example Usage

```typescript
const resetPasscode = async (): Promise<PasscodeSuccessResponse> => {
  const response = await fetch('/api/user/passcode/reset', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};
```

---

### 4. Regenerate Certificate and Passcode

Generate a new certificate with a new passcode. Use this when the certificate has expired or is about to expire. This creates a new 1-year validity certificate.

```
POST /api/user/passcode/regenerate
```

#### Request Body
None required.

#### Response (200 OK)

```json
{
  "message": "Certificate has been regenerated and passcode sent to your email"
}
```

#### Response (400 Bad Request) - No Email

```json
{
  "error": "No email configured for user"
}
```

#### Response (401 Unauthorized)

```json
{
  "error": "Not authenticated"
}
```

#### Response (404 Not Found)

```json
{
  "error": "Employee not found"
}
```

#### Response (500 Internal Server Error)

```json
{
  "error": "An unexpected error occurred while regenerating certificate"
}
```

#### Example Usage

```typescript
const regenerateCertificate = async (): Promise<PasscodeSuccessResponse> => {
  const response = await fetch('/api/user/passcode/regenerate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAccessToken()}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
};
```

---

## HTTP Status Codes Summary

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 400 | Bad Request (e.g., no email configured) |
| 401 | Not authenticated (missing or invalid JWT) |
| 404 | Resource not found (certificate or employee) |
| 500 | Internal server error |

---

## Frontend Integration Guide

### When to Use Each Endpoint

| Scenario | Endpoint |
|----------|----------|
| App initialization / Login | `GET /user/certificate/status` |
| User forgot passcode | `POST /user/passcode` |
| User wants new passcode (certificate valid) | `POST /user/passcode/reset` |
| Certificate expired or expiring | `POST /user/passcode/regenerate` |

### Certificate Status Logic

```typescript
const handleCertificateStatus = (status: CertificateStatusDTO) => {
  if (!status.hasCertificate || status.isExpired) {
    // Show error modal - force user to regenerate
    showCertificateExpiredModal();
    blockApprovalActions();
  } else if (status.isExpiring) {
    // Show warning banner - certificate expires within 5 days
    showExpiryWarningBanner(status.daysUntilExpiry);
  }
  // else: normal flow, no notification needed
};
```

### Recommended Fetch Intervals

- **On Login**: Always fetch certificate status
- **Periodic Check**: Every 1 hour while app is active
- **After Regeneration**: Immediately re-fetch to update UI

---

## Example: Complete API Service

```typescript
// src/api/certificateApi.ts

const API_BASE = '/api';

export const certificateApi = {
  /**
   * Get certificate status for current user
   */
  getStatus: async (): Promise<CertificateStatusDTO> => {
    const response = await fetch(`${API_BASE}/user/certificate/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get certificate status');
    }

    return response.json();
  },

  /**
   * Request existing passcode to be sent via email
   */
  requestPasscode: async (): Promise<PasscodeSuccessResponse> => {
    const response = await fetch(`${API_BASE}/user/passcode`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send passcode email');
    }

    return response.json();
  },

  /**
   * Reset passcode (generate new passcode, keep certificate)
   */
  resetPasscode: async (): Promise<PasscodeSuccessResponse> => {
    const response = await fetch(`${API_BASE}/user/passcode/reset`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reset passcode');
    }

    return response.json();
  },

  /**
   * Regenerate certificate and passcode
   */
  regenerate: async (): Promise<PasscodeSuccessResponse> => {
    const response = await fetch(`${API_BASE}/user/passcode/regenerate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to regenerate certificate');
    }

    return response.json();
  }
};
```