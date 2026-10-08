<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep all primary SPEKTRA areas as separate TanStack routes inside one shared application shell, so navigation and page metadata remain consistent.
- Keep Situasi data, per-situation risk profiles, and reusable analytical UI in a shared feature module, so its three routes remain consistent and traceable.
- Route Situasi entries through a shared dynamic detail layout, so EWS findings and monitored topics use one analytical workspace without duplicating data.
- Strategy data, recommendation logic, and state live in `src/features/strategi`; Situation and Strategy providers wrap the app in `__root` so context carries Situasi → Strategi → Aksi.
- Aksi data, approval gates, and state live in `src/features/aksi`; its provider wraps the app in `__root` so the approval queue sees production, social, and news items together.
- Distribusi Sosial rules (accounts, post planning, readiness, approval→status mapping) live as pure functions in `src/features/aksi/sosial.ts`, so the wizard, detail page, Persetujuan and tests share one source of truth.
- Read-only distribution asset previews use the shared AssetPreview renderer, so selection, packages, review, and approvals show the same source asset without production controls.
- News channel domains are derived through the shared `newsChannelDomain` helper, so all 39 fixed-network identities stay consistent across ordering, approval, and verification views.
