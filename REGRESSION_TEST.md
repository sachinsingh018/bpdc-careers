# BPDC Career Profile – Regression Test Script

Quick checklist to verify core flows after changes. Test on desktop and mobile when possible.

---

## 1. Landing & Auth

- [ ] **Home (logged out)** – Visit `/`. See landing page with "Create Profile" and "Scan profiles" buttons.
- [ ] **Home (logged in with profile)** – Visit `/` while logged in. Redirect to `/dashboard` without red error box.
- [ ] **Initial loader** – Brief loading spinner appears on first load, then content.
- [ ] **Sign up** – Create account with email. Redirect to profile creation.
- [ ] **Sign in** – Log in with existing email. Redirect to dashboard.
- [ ] **Sign out** – Click "Sign out". Return to home, nav shows "Sign in" and "Create account".

---

## 2. Profile

- [ ] **Create profile** – Fill form (name, email, degree, etc.). Submit. Redirect to dashboard.
- [ ] **Edit profile** – From dashboard, change fields and save. Changes persist.
- [ ] **Profile photo** – Upload JPG/PNG. Photo appears in dashboard and public profile.
- [ ] **Resume** – Upload PDF. Download link works on public profile.

---

## 3. Dashboard & My Profile

- [ ] **Dashboard** – Shows profile card, QR code, edit form.
- [ ] **QR code** – Renders correctly. Encodes full profile URL.
- [ ] **My profile** – Click "My profile". See profile card with QR code.
- [ ] **View public profile** – Click "View public profile". Opens `/p/{id}` in new tab.

---

## 4. Scan

- [ ] **Scan page** – Visit `/scan`. Camera view or "Camera not available" fallback.
- [ ] **Camera denied** – Deny camera. See friendly message and manual entry form (no crash).
- [ ] **Manual entry** – Enter profile ID or `/p/xxx`. Submit. Navigate to profile.
- [ ] **Manual entry validation** – Submit empty or invalid input. See error message.

---

## 5. Public Profile

- [ ] **View profile** – Visit `/p/{valid-id}`. See full profile (name, degree, bio, skills, resume link).
- [ ] **Invalid profile** – Visit `/p/invalid-id`. See "Profile not found" page.

---

## 6. Layout & UI

- [ ] **Header** – Logo, nav links, and auth buttons visible and clickable.
- [ ] **Watermark** – BPDC logo visible (subtle) in background.
- [ ] **Mobile menu** – Hamburger opens nav on small screens.
- [ ] **No red error box** – No unexpected error banner at bottom (except real errors).

---

## 7. Edge Cases

- [ ] **Direct URL** – Logged-in user visits `/` directly. Redirects to dashboard.
- [ ] **Protected routes** – Visit `/dashboard` logged out. Redirect to login.
- [ ] **Loading state** – Route transitions show loading spinner briefly.
