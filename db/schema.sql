



CREATE OR REPLACE FUNCTION get_dashboard_data(p_user_id uuid)
RETURNS json LANGUAGE sql SECURITY DEFINER AS $$
  SELECT json_build_object(
    -- Onboarding
    'roles_complete',       EXISTS (SELECT 1 FROM user_target_role  WHERE user_id = p_user_id),
    'personal_complete',    EXISTS (SELECT 1 FROM user_profile      WHERE id      = p_user_id),
    'history_complete',     EXISTS (SELECT 1 FROM user_job_history  WHERE user_id = p_user_id),
    'credentials_complete', EXISTS (SELECT 1 FROM user_education    WHERE user_id = p_user_id),
    'skills_complete',      EXISTS (SELECT 1 FROM user_skill        WHERE user_id = p_user_id),
    -- Dashboard stats
    'jobs_tracked', 0,
  'jobs_added_this_week', 0,
  'applications_sent', 0,
  'applications_awaiting', 0,
  'interviews_total', 0,
  'interviews_scheduled', 0,
  'avg_interview_minutes', 0,
  'longest_interview_minutes', 0,
  'resumes_created', 0,
  'resumes_this_week', 0,
  -- Twin activity
  'twin_sessions', 0,
  'twin_total_minutes', 0,
  'twin_questions_answered', 0,
  'twin_avg_rating', 0,
  -- Pipeline
  'jobs',          '[]'::json,
  'events',        '[]'::json,
  'interview_stages', '[]'::json
  )
$$;