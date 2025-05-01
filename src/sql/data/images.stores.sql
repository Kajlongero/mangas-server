INSERT INTO commons.store_names (name) VALUES 
  ('USER_COVER_IMAGES'),
  ('USER_BACKGROUND_IMAGES');

INSERT INTO commons.store_services (name) VALUES
  ('OWN'),
  ('AWS'),
  ('AZURE'),
  ('CLOUDFLARE'),
  ('GOOGLE_CLOUD');

INSERT INTO commons.images_store (absolute_url, relative_url, is_external, priority_id, store_name_id, store_service_id) VALUES ('C:\\Users\\carlo\\Documents\\Portfolio\\mangas\\server\\uploads\\images\\user', 'http://localhost:3333/api/v1/static/images/user/profile', false, 3, 1, 1),
('C:\\Users\\carlo\\Documents\\Portfolio\\mangas\\server\\uploads\\images\\user', 'http://localhost:3333/api/v1/static/images/user/background', false, 3, 2, 1);
