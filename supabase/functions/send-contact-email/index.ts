// TODO(v1.1): port contact-form email send to a Supabase Edge Function so it
// runs independent of Next.js runtime. v1 uses the Next.js server action
// (lib/actions/contact.ts) directly — simpler for a staging launch.
//
// When porting, the contract is:
//   POST /functions/v1/send-contact-email
//   body: { name, email, subject?, message }
//   auth: none (public)
//   behavior: zod-validate → rate-limit (Upstash) → insert contact_submissions
//             → Resend send → 200 on DB insert success regardless of send
//
// Until then, this file exists only as a placeholder so the deployment
// pipeline is aware of the intended edge function location.
export {};
