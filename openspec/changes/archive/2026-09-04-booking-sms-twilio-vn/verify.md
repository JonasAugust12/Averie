# Verification Report

> Generated after apply to confirm implementation matches specs / design / tasks.

**Change**: `booking-sms-twilio-vn`  
**Verified at**: `2026-09-04 17:35 UTC+7`  
**Iteration**: `1`  
**Verifier**: `inline-opsx-verify`

---

## Summary

| Dimension    | Status                                      |
| ------------ | ------------------------------------------- |
| Completeness | 13/14 tasks, 11/11 requirements implemented |
| Correctness  | 11/11 reqs covered (no automated tests)     |
| Coherence    | Followed design; 2 OpenAPI doc gaps fixed   |

---

## 1. Structural Validation (`openspec validate --all --json`)

- [x] All items `"valid": true`

**Result**: 11/11 passed (`booking-sms-twilio-vn` change + 10 main specs). INFO-only long-requirement notices on unrelated specs.

---

## 2. Task Completion (`tasks.md`)

- [x] 13 complete
- [ ] 1 incomplete (operator manual QA)

| Task | Reason incomplete              | Blocks archive? |
| ---- | ------------------------------ | --------------- |
| 7.2  | Manual Twilio smoke (operator) | No              |

---

## 3. Delta Spec Sync State

| Capability              | Sync status    | Notes                                     |
| ----------------------- | -------------- | ----------------------------------------- |
| salon-transactional-sms | ✗ pending sync | NEW capability — not in `openspec/specs/` |
| appointment-booking     | ✗ pending sync | SMS requirements not in main spec         |
| salon-persistence       | ✗ pending sync | `smsNotifications` not in main spec       |

Run `/opsx-sync booking-sms-twilio-vn` before archive.

---

## 4. Design / Specs Coherence

| Sample item            | design.md                       | Implementation                         | Gap                                              |
| ---------------------- | ------------------------------- | -------------------------------------- | ------------------------------------------------ |
| `sms.server.ts` module | Mirror `email.server.ts`        | `src/server/sms.server.ts`             | None                                             |
| VN normalizer          | `phone-vn.util.ts`              | `src/utils/phone-vn.util.ts`           | None                                             |
| Hook in create action  | After email block               | `booking.action.ts:124-148`            | None                                             |
| Graceful env skip      | Log + no throw                  | `sms.server.ts:10-23`                  | None                                             |
| Public API exposure    | Open Q: create-only recommended | `serializeBooking` exposes on all GETs | Minor — supports confirmation revisit (task 6.2) |

**Drift warnings** (non-blocking):

- Confirmation page fetches booking via `GET /api/bookings/by-reference`, so `smsNotifications` is exposed on public read paths — acceptable for SMS-sent badge on revisit.

---

## 5. Requirement Implementation Mapping

### salon-transactional-sms (4 requirements)

| Requirement                   | Evidence                                                |
| ----------------------------- | ------------------------------------------------------- |
| Twilio SMS provider config    | `sms.server.ts:4-28,47-64`                              |
| Vietnam E.164 normalization   | `phone-vn.util.ts:12-42`                                |
| Booking confirmation SMS body | `sms.server.ts:31-45` (Vietnamese, reference/date/time) |
| Twilio setup documentation    | `docs/twilio-sms-setup.md`                              |

### appointment-booking (modified)

| Requirement / Scenario  | Evidence                                                        |
| ----------------------- | --------------------------------------------------------------- |
| Phone SMS guidance UI   | `CustomerStep.tsx`, `messages/*/booking.json`                   |
| SMS on VN phone create  | `booking.action.ts:124-148`                                     |
| No SMS for non-VN       | `booking.action.ts:126-130`                                     |
| SMS failure → still 201 | try/catch in action; `sendBookingConfirmationSms` returns false |

### salon-persistence (modified)

| Requirement                   | Evidence                                                    |
| ----------------------------- | ----------------------------------------------------------- |
| `smsNotifications` on Booking | `booking.model.ts:75-77`                                    |
| DTO exposure                  | `booking.type.ts`, `booking.mapper.ts`, `booking.schema.ts` |

---

## 6. OpenAPI / Action Docs

| Item                                       | Status  | Notes                                                                          |
| ------------------------------------------ | ------- | ------------------------------------------------------------------------------ |
| Zod schema `smsNotifications`              | ✓       | `src/openapi/schemas/booking.schema.ts`                                        |
| Hand-written action doc                    | ✓ fixed | `openapi/fragments/actions.yaml` — SMS behavior added to `createBookingAction` |
| Example DTO                                | ✓ fixed | `src/openapi/examples/booking.examples.ts`                                     |
| Generated `openapi/generated/openapi.json` | ⚠ stale | Missing `smsNotifications` until `pnpm openapi:gen` is run                     |

**Recommendation**: Run `pnpm openapi:gen` and commit the regenerated JSON so Scalar docs match the Zod schema.

---

## 7. Implementation Signal

- [ ] Uncommitted changes present (expected — apply not yet committed)
- [ ] Not pushed

**Commit range**: `none` (uncommitted)

---

## Issues by Priority

### CRITICAL

None.

### WARNING

1. **Generated OpenAPI JSON stale** — `openapi/generated/openapi.json` lacks `smsNotifications` on `bookingDtoSchema` / `bookingListItemDtoSchema`.  
   **Recommendation**: Run `pnpm openapi:gen` and commit output.

2. **Delta specs not synced to main** — 3 capabilities pending.  
   **Recommendation**: `/opsx-sync booking-sms-twilio-vn` before archive.

3. **Manual smoke not run (task 7.2)** — Twilio trial + verified +84 number required.  
   **Recommendation**: Follow `docs/twilio-sms-setup.md`; mark 7.2 complete after smoke.

4. **No automated tests** — scenarios verified by code inspection only (project has no test harness).  
   **Recommendation**: Accept for v1; manual cases documented in setup guide.

### SUGGESTION

1. SMS body uses ASCII diacritics-free Vietnamese (`Dat lich` vs `Đặt lịch`) — intentional for GSM-7; consider Unicode if Twilio segment cost acceptable.

---

## Overall Decision

- [ ] ✅ PASS
- [x] ⚠️ **PASS WITH WARNINGS** — ready to proceed after `pnpm openapi:gen` and optional manual smoke
- [ ] ❌ FAIL

**Next step**:

1. Run `pnpm openapi:gen` (regenerates `openapi/generated/openapi.json`).
2. Optional: manual Twilio smoke (task 7.2).
3. Commit implementation + OpenSpec artifacts.
4. `/opsx-sync booking-sms-twilio-vn` then `/opsx-archive booking-sms-twilio-vn`.
