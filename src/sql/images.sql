CREATE TABLE commons.priorities (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE,
  priority INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS commons.store_names (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS commons.store_services (
  id SERIAL NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS commons.images_store (
  id SERIAL NOT NULL PRIMARY KEY,
  absolute_url VARCHAR,
  relative_url VARCHAR,
  is_external BOOLEAN DEFAULT false,
  priority_id INTEGER,
  store_name_id INTEGER,
  store_service_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT fk_priorities_images_store 
    FOREIGN KEY (priority_id) 
    REFERENCES commons.priorities(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CONSTRAINT fk_store_names_images_store
    FOREIGN KEY (store_name_id)
    REFERENCES commons.store_names 
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  CONSTRAINT fk_store_services_images_store 
    FOREIGN KEY (store_service_id)
    REFERENCES commons.store_services 
    ON UPDATE CASCADE 
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS commons.images (
  id SERIAL NOT NULL PRIMARY KEY,
  url VARCHAR NOT NULL,
  images_store_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  CONSTRAINT fk_images_images_store 
    FOREIGN KEY (images_store_id) 
    REFERENCES commons.images_store(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
);