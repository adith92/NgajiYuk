begin;

create index if not exists learning_progress_profile_owner_fk_idx
  on public.learning_progress(profile_id, owner_id);

create index if not exists quiz_sessions_profile_owner_fk_idx
  on public.quiz_sessions(profile_id, owner_id);

create index if not exists reward_entitlements_profile_owner_fk_idx
  on public.reward_entitlements(profile_id, owner_id);

create index if not exists reward_entitlements_quiz_owner_profile_fk_idx
  on public.reward_entitlements(source_quiz_session_id, owner_id, profile_id);

commit;
