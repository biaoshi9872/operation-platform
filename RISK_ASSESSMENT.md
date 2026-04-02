# Security Risk Assessment - supplychainapi_platform

**Generated:** 2026-04-02  
**Project:** supplychainapi_platform  
**Severity:** High Risk (12 issues found)

---

## 🔴 Critical Issues

### 1. Hardcoded AES Keys + Insecure ECB Mode
- **File:** `src/utils/encrypt.ts:12,27,40`
- **Type:** Security Vulnerability
- **Severity:** Critical
- **Description:** AES key hardcoded in frontend; ECB mode used simultaneously. Frontend "encryption" is reversible obfuscation only.
- **Fix:** Delete frontend symmetric key encryption; move to server-side with proper key management.

---

## 🟠 High Severity

### 2. Token in localStorage
- **File:** `src/views/login/index.vue:121`, `src/stores/modules/user.ts:17,23`, `src/utils/axios/request.ts:29`
- **Type:** Security Risk
- **Severity:** High
- **Description:** Access token stored in localStorage, read directly for request headers. XSS can steal tokens.
- **Fix:** Use `HttpOnly + Secure + SameSite` Cookie; avoid long-term credentials in frontend.

### 3. Multiple XSS via v-html
- **File:** `src/components/ProductDetail/BaseProductDetail.vue:136,190`, `BonusProductDetail.vue:163`, `VirtualProductDetail.vue:171`, etc.
- **Type:** XSS
- **Severity:** High
- **Description:** Product detail fields rendered via `v-html` without sanitization.
- **Fix:** Default to plain text; use DOMPurify for rich text; reject dangerous tags/attributes.

### 4. Untrusted iframe URL Loading
- **File:** `src/layout/Router/Iframe.vue:31,33`, `src/router/index.ts:26`
- **Type:** Security Vulnerability
- **Severity:** High
- **Description:** `/iframe` page trusts `query.url` without domain whitelist or protocol check.
- **Fix:** Whitelist allowed domains; only allow `https`; add `sandbox`/`referrerpolicy`.

### 5. Unsafe External Link Handling
- **File:** `src/components/JinDLink/index.vue:106,116`, `InputRequired/index.vue:111`, `downloadCenter/index.vue:60`
- **Type:** Security Risk
- **Severity:** High
- **Description:** Untrusted URLs used in `<a href target="_blank">` and `window.open()` without `rel="noopener noreferrer"`.
- **Fix:** Whitelist and validate URL protocol; use `window.open(url, '_blank', 'noopener,noreferrer')`.

### 6. XSS + ReDoS via TextLight Search
- **File:** `src/components/TextLight/index.vue:18,19,24`
- **Type:** Security Vulnerability / Performance
- **Severity:** High
- **Description:** `searchValue` used in `new RegExp()` without escaping; concatenated into `v-html`.
- **Fix:** Escape search value first; don't use `v-html` for highlighting.

---

## 🟡 Medium Severity

### 7. Debug Logs with Sensitive Info
- **File:** `src/utils/axios/request.ts:95,96`, `src/hooks/isEevCheckHooks.ts:23,24`, `src/api/files/index.ts:7`, etc.
- **Type:** Information Disclosure
- **Severity:** Medium
- **Description:** Extensive `console.log` and `debugger` printing tokens, cookies, full responses.
- **Fix:** Remove all debug residue; use controlled logger with environment-based levels.

### 8. Event Listener Leak
- **File:** `src/views/login/index.vue:186,188`
- **Type:** Resource Leak
- **Severity:** Medium
- **Description:** `resize` listener registered at module level without removal.
- **Fix:** Register in `onMounted`, remove in `onUnmounted`.

### 9. Async/Timer Issues
- **File:** `src/components/ForgetPwd/index.vue:85,100,120`
- **Type:** Code Quality
- **Severity:** Medium
- **Description:** `sendCode` lacks `await`/Promise return; `setInterval` created but `clearTimeout` used to clear.
- **Fix:** Use proper async/await; use `clearInterval` consistently.

### 10. Empty Catch Blocks in Router
- **File:** `src/router/index.ts:69,97`, `src/stores/modules/router.ts:94`
- **Type:** Code Quality
- **Severity:** Medium
- **Description:** Router catch blocks only log, don't call `next()` - navigation hangs.
- **Fix:** Always call `next('/login')` or `next(false)` on failure; never use empty catch.

### 11. Upload Token Issues
- **File:** `src/components/ImgUpload/FileUpload.vue:15,79,121`, `index.vue:22,96,209`
- **Type:** Security Risk
- **Severity:** Medium
- **Description:** Token read at initialization, may use stale token after refresh; file validation only client-side.
- **Fix:** Read token at request time; enforce validation server-side.

---

## 🟢 Low Severity

### 12. Debug Build Artifacts
- **File:** `vite.config.ts:30,31`, `src/utils/routerUtils.ts:86`, `src/layout/index.vue:57`
- **Type:** Best Practice
- **Severity:** Low
- **Description:** Nonsense logs and debug branches in production build; `manualChunks` debug logic.
- **Fix:** Add ESLint rules (`no-console`, `no-debugger`, `no-empty`); remove debug code.

---

## Summary Statistics

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 6 |
| Medium | 3 |
| Low | 1 |
| **Total** | **12** |

---

## Recommended Priority

1. **Immediate:** Remove hardcoded keys, fix v-html XSS points
2. **Short-term:** Fix iframe URL whitelist, external link security
3. **Medium-term:** Remove debug logs, fix event listener leaks, add quality gates
