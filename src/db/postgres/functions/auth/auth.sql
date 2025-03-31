CREATE OR REPLACE FUNCTION security.register_user (
  username VARCHAR,
  email VARCHAR,
  password VARCHAR 
) RETURNS TABLE (
  user_id UUID,
  auth_id INTEGER,
  profile_id INTEGER,
  role_id INTEGER,
  role_name VARCHAR
) 
AS $$
DECLARE 
  t_user_id UUID;
  t_auth_id INTEGER;
  t_profile_id INTEGER;
  t_auth_info_id INTEGER;
  t_role_id INTEGER;
  t_role_name VARCHAR;
BEGIN    
  INSERT INTO security.users (username)
  VALUES (username)
  RETURNING id INTO t_user_id;

  INSERT INTO security.auth (user_id)
  VALUES (t_user_id)
  RETURNING id INTO t_auth_id;

  INSERT INTO security.profile (user_id)
  VALUES (t_user_id)
  RETURNING id INTO t_profile_id;

  INSERT INTO security.auth_info (auth_id, email, password) 
  VALUES (t_auth_id, email, password)
  RETURNING id INTO auth_info_id;

  SELECT rdv.role_id as role_id, rdv.role_name INTO t_role_id, t_role_name
  FROM security.roles_dedicated_view AS rdv
  WHERE rdv.role_name = 'REGULAR_USER';

  INSERT INTO security.auth_roles (role_id, auth_id) VALUES
  (t_role_id, t_auth_id);

  RETURN QUERY SELECT t_user_id, t_auth_id, t_profile_id, t_role_id, t_role_name;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Transaction rolled back due to an error: %', SQLERRM;
    RETURN;
END; 
$$ language plpgsql;

CREATE OR REPLACE FUNCTION security.change_password (
  p_id INTEGER,
  ses_id BIGINT,
  hash VARCHAR
) RETURNS TABLE (LIKE security.auth_info) 
AS $$ 
DECLARE 
  t_auth_id INTEGER;
BEGIN
  UPDATE security.auth_info SET password = hash WHERE id = p_id
  RETURNING auth_id INTO t_auth_id;

  DELETE FROM security.active_sessions WHERE auth_id = t_auth_id AND id != ses_id;

  RETURN QUERY SELECT * FROM security.auth_info WHERE auth_id = t_auth_id; 
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Transaction rolled back to an error: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION security.password_recovery_record (
  auth_id INTEGER,
  code INTEGER,
  change_token VARCHAR,
  verification_token VARCHAR
) RETURNS TABLE (LIKE security.auth_recovery) 
AS $$ 
DECLARE
  t_interval TIMESTAMPTZ;
  t_rec_id UUID;
BEGIN
  t_interval = SELECT NOW() + '30 min';

  INSERT INTO security.auth_recovery (auth_id, code, change_token, verification_token, expires_at)
  VALUES (auth, code, change_token, verification_token, t_interval) RETURNING id INTO t_rec_id;

  RETURN QUERY SELECT * FROM security.auth_recovery WHERE id = t_rec_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Transaction rolled back due to an error: %', SQLERRM;
    RETURN;
END; 
$$ language plpgsql;

CREATE OR REPLACE FUNCTION security.change_password_by_recovery (
  auth_id INTEGER,
  hash VARCHAR,
) RETURNS TABLE (LIKE security.auth_info) 
AS $$
DECLARE
  UPDATE security.auth_info SET password = hash
  WHERE auth_id = auth_id;

  UPDATE security.auth SET password_recovery_until = null 
  WHERE id = auth_id;

  DELETE FROM security.auth_recovery WHERE auth_id = auth_id;
  DELETE FROM security.active_sessions WHERE auth_id = auth_id;

  RETURN QUERY SELECT * FROM security.auth_info WHERE auth_id = auth_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Transaction rolled back due to an error: %', SQLERRM;
    RETURN;
END; 
$$ language plpgsql;