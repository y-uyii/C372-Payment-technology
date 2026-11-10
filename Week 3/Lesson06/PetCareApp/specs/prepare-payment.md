# Feature: Prepare payment details

## 1. User goal

Allow pet owners to prepare payment details for one specific pet service.

## 2. Scope

The service catalogue is the source of truth for service names and prices. The server chooses the price.

| ID | Service | Price |
| --- | --- | --- |
| 1 | Grooming | SGD 50 |
| 2 | Vaccination | SGD 35 |
| 3 | Boarding | SGD 80 |

This feature prepares service details and a price for review. It does not process a payment or confirm that a payment succeeded.

Access: No login is required for this classroom mock endpoint.

Retrieving the full service list is separate from preparing details for one service. It should use a separate endpoint, such as `GET /services`; that endpoint is not specified here.

Design constraints to confirm: no charging, no payment gateway, no new database tables, and no new pages. The recommendation is to reuse existing database tables and pages wherever possible.

## 3. Request

Use `GET /payments/prepare/:serviceId` to prepare payment details for the specific service identified by `serviceId`.

## 4. Successful response

Return a JSON response containing:

- `serviceId`: number
- `serviceName`: string
- `price`: number
- `currency`: string
- `status`: string

The `status` value is `READY_FOR_PAYMENT`. It means the service details and price have been prepared successfully; no payment has been processed and no payment success has been confirmed.

Example:

{
  "serviceId": 1,
  "serviceName": "Grooming",
  "price": 50,
  "currency": "sgd",
  "status": "READY_FOR_PAYMENT"
}

## 5. Unsuccessful responses

If `serviceId` is missing, non-numeric, zero, negative, or malformed, return HTTP 400 Bad Request:

{"error":"Invalid service ID"}

A positive integer `serviceId` that does not match an existing service is valid in format but unknown. Return HTTP 404 Not Found:

{"error":"Service not found"}

## 6. Acceptance criteria

- AC1: For service ID 1, return the successful response with `serviceId` 1, `serviceName` "Grooming", `price` 50, `currency` "sgd", and `status` "READY_FOR_PAYMENT".
- AC2: For service ID 2, return the successful response with `serviceId` 2, `serviceName` "Vaccination", `price` 35, `currency` "sgd", and `status` "READY_FOR_PAYMENT".
- AC3: For service ID 3, return the successful response with `serviceId` 3, `serviceName` "Boarding", `price` 80, `currency` "sgd", and `status` "READY_FOR_PAYMENT".
- AC4: For a positive integer service ID that does not match an existing service, return HTTP 404 Not Found with `{"error":"Service not found"}`.
- AC5: For a missing, non-numeric, zero, negative, or malformed service ID, return HTTP 400 Bad Request with `{"error":"Invalid service ID"}`.
- AC6: A successful response indicates only that the service details and price were prepared; it does not indicate that payment was processed or succeeded.

## 7. Open questions

- What HTTP status code should successful requests return?
- Should the catalogue name be "Grooming" or "Pet Grooming"? The scope notes and catalogue currently use different names.
- Are “no new database tables” and “no new pages” assignment requirements, or design constraints to confirm?