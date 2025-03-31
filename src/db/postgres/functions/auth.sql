CREATE OR REPLACE FUNCTION security.create_recovery_password_record (
  p_auth_id INTEGER,
  p_code INTEGER,
  p_change_token VARCHAR,
  p_verification_token VARCHAR
) RETURNS TABLE 
  (LIKE security.auth_recovery)
AS $$ 
DECLARE 
  t_id UUID;
  t_time_w_interval TIMESTAMPTZ;
BEGIN
  t_time_w_interval := NOW() + '30 min';

  INSERT INTO security.auth_recovery(auth_id, code, change_token, verification_token, expires_at)
  VALUES (p_auth_id, p_code, p_change_token, p_verification_token, t_time_w_interval)
  RETURNING id INTO t_id;

  RETURN QUERY SELECT * FROM security.auth_recovery WHERE id = t_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Failed to create the recovery email record due to an error: %', SQLERRM;
    RETURN;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION security.change_password_by_recovery (
  p_auth_id INTEGER,
  p_password VARCHAR
) RETURNS TABLE (LIKE security.auth_info) 
AS $$
BEGIN
  UPDATE security.auth_info SET password = p_password
  WHERE auth_id = p_auth_id;

  UPDATE security.auth SET password_recovery_until = null 
  WHERE id = p_auth_id;

  DELETE FROM security.auth_recovery WHERE auth_id = p_auth_id;
  DELETE FROM security.active_sessions WHERE auth_id = p_auth_id;

  RETURN QUERY SELECT * FROM security.auth_info WHERE auth_id = p_auth_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Failed to change password and delete changes due to an error: %', SQLERRM;
    RETURN;
END;
$$ LANGUAGE plpgsql;