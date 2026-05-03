# WishCraft Project Report

## 1. Problem-Solving Approach: Image Overlay Logic

The goal was to let users generate shareable greeting images by combining template visuals with user-personalized content (avatar, name, and wish text), then export the final composition as a PNG.

### Approach
- A layered UI was built in `PreviewCanvas` using CSS absolute positioning.
- Visual layers are stacked in this order:
  1. Gradient background
  2. Decorative circles and emoji
  3. Foreground overlay (avatar ring, user name, wish text)
- The entire preview container is captured using `html2canvas` for export and sharing.

### Key Implementation Decisions
- `html2canvas` is configured with:
  - `useCORS: true` for cross-origin image support
  - `scale: 2` for high-resolution output
  - `backgroundColor: null` to preserve visual fidelity
- External avatar URLs (for example, Google profile photos) are converted to Base64 in the browser before rendering to avoid canvas tainting/CORS export failures.
- If image sharing is not supported on a device/browser, the app falls back gracefully to PNG download plus text-based share links.

This architecture keeps the experience consistent across platforms while still delivering a high-quality exported greeting.

## 2. Tech Stack

### Frontend
- React 18
- Vite
- Zustand (state management)
- React Router
- CSS Modules
- `html2canvas` (DOM-to-image export)
- Firebase Auth (Google sign-in)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- Multer (avatar uploads)
- bcryptjs (password hashing)
- CORS + dotenv

### Deployment
- Vercel (frontend)
- Render (backend API)

## 3. Challenges and How They Were Overcome

### 1) Cross-Origin Avatar Rendering in Exported Images
- Challenge: External avatars can fail when rendering to canvas due to CORS restrictions.
- Solution: Added a preprocessing step to fetch and convert external images to Base64 before drawing/export.

### 2) Environment-Specific API Routing (Local vs Production)
- Challenge: Local development used Vite proxy (`/api`), but production required full backend URL.
- Solution: Introduced environment-based API base URL (`VITE_API_BASE_URL`) and normalized asset URLs for uploaded avatars.

### 3) Frontend-Backend CORS Coordination
- Challenge: Deployed frontend domains and backend CORS settings can mismatch, causing blocked requests/forbidden behavior.
- Solution: Configured backend CORS to validate allowed origins through environment variables and support deployment domain patterns safely.

### 4) OAuth Domain Authorization
- Challenge: Google sign-in can fail with `auth/unauthorized-domain` after deployment.
- Solution: Added deployed frontend domains to Firebase Authorized Domains and ensured all Firebase env values belong to the same Firebase project.

## 4. Future Improvements (Scalability Considerations)

### Infrastructure and Storage
- Move avatar uploads from local disk to object storage (AWS S3 / Cloudinary / GCS) to avoid ephemeral storage issues and improve durability.
- Add CDN caching for templates/assets and generated images.

### Backend Scalability
- Add Redis caching for template metadata and session-related lookups.
- Introduce API rate limiting and request throttling for abuse protection.
- Split services by concern (auth, templates, media) as traffic grows.

### Data and Reliability
- Add structured logging, monitoring, and alerting (for example, OpenTelemetry + hosted logs).
- Add background job processing (queues) for heavy image operations and async tasks.
- Add automated backups and recovery policy for MongoDB data.

### Product and Engineering
- Add automated test coverage (unit + integration + e2e).
- Add webhook-verified real payment integration (instead of mock premium flow).
- Introduce template CMS/admin workflow so templates can be updated without code deploys.

## Conclusion

The current implementation delivers a practical and user-friendly greeting generator with strong core functionality. The architecture is suitable for MVP-to-early-scale usage, and the listed improvements provide a clear path for production hardening and growth.
