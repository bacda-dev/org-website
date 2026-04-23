## Summary

<!-- 1-3 bullets: what this PR changes and why. Link the PLAN.md ticket ID if applicable (e.g. W2-T3). -->

-
-

## Verification checklist

<!-- Per PRD §9.4. Check what applies; strike what doesn't. -->

- [ ] `npm run test` passes
- [ ] `npm run typecheck` clean
- [ ] `npm run lint` clean
- [ ] Lighthouse preview run acceptable (UI changes only)
- [ ] Manual smoke test on Netlify preview URL
- [ ] No disallowed env vars added (`YOUTUBE_API_KEY`, `GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, Mailchimp)
- [ ] RLS / security reviewed (if touching Supabase)
- [ ] Handoff note written if dispatched by orchestrator (`.agent-handoffs/<ticket>.md`)

## Screenshots / notes

<!-- Optional: before/after screenshots for UI changes, or special rollout notes. -->
