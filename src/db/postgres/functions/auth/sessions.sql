CREATE OR REPLACE FUNCTION security.create_session (
  auth_id INTEGER,
  key TEXT
) RETURNS TABLE (LIKE security.active_sessions)
AS $$ 
DECLARE
  t_sid BIGINT;
  t_interval TIMESTAMPTZ;
BEGIN
  t_interval := NOW() + '6 mon';

  INSERT INTO security.active_sessions (auth_id, public_key, expires_at)
  VALUES (auth_id, key, t_interval)
  RETURNING id INTO t_sid;

  RETURN QUERY SELECT * FROM security.active_sessions WHERE id = t_sid;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Failed to create session due to an error: %', SQLERRM;
    RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION security.refresh_session(
  session_id BIGINT,
  at_jti VARCHAR,
  rt_jti VARCHAR
) RETURNS TABLE (LIKE security.active_sessions)
AS $$
DECLARE
  t_interval TIMESTAMPTZ;
BEGIN
  t_interval := NOW() + '6 mon';

  UPDATE security.active_sessions SET at_jti = at_jti, rt_jti = rt_jti, expires_at = t_interval, updated_at = (SELECT NOW())
  WHERE id = session_id;

  RETURN QUERY SELECT * FROM security.active_sessions WHERE id = session_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Failed to refresh session due to an error: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;