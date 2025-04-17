CREATE OR REPLACE FUNCTION security.create_session (
  p_auth_id INTEGER,
  p_key TEXT,
  p_interval TIMESTAMPTZ
) RETURNS TABLE (LIKE security.active_sessions)
AS $$ 
DECLARE
  t_sid BIGINT;
BEGIN
  INSERT INTO security.active_sessions (auth_id, public_key, expires_at)
  VALUES (p_auth_id, p_key, p_interval)
  RETURNING id INTO t_sid;

  RETURN QUERY SELECT * FROM security.active_sessions WHERE id = t_sid;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Failed to create session due to an error: %', SQLERRM;
    RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION security.refresh_session(
  p_session_id BIGINT,
  p_time TIMESTAMPTZ
) RETURNS TABLE (LIKE security.active_sessions)
AS $$
DECLARE
  t_interval TIMESTAMPTZ;
BEGIN
  UPDATE security.active_sessions SET at_jti = (SELECT uuid_generate_v4()), rt_jti = (SELECT uuid_generate_v4()), expires_at = p_time, updated_at = (SELECT NOW())
  WHERE id = p_session_id;

  RETURN QUERY SELECT * FROM security.active_sessions WHERE id = p_session_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Failed to refresh session due to an error: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;