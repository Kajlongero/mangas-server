INSERT INTO security.roles_categories (name) VALUES
('ADMINISTRATION'),
('STANDARD'),
('GROUPS');

INSERT INTO security.roles (name, description, is_special) VALUES
('OWNER', 'Owner', true),
('ADMIN', 'Administrator', true),
('MODERATOR', 'Moderator', true),
('DONATOR', 'Donator', true),
('USER', 'User', false),
('GUEST', 'Guest', false),
('READER', 'Reader', false),
('TRANSLATOR', 'Translator', true),
('TYPESETTER', 'Typesetter', true),
('CLEANER', 'Cleaner', true),
('EDITOR', 'Editor', true),
('PROOFREADER', 'Proofreader', true);

INSERT INTO security.roles_categories_roles (role_id, roles_categories_id) VALUES 
(1, 1),
(2, 1),
(3, 1),
(4, 2),
(5, 2),
(6, 2),
(7, 2),
(8, 3),
(9, 3),
(10, 3),
(11, 3),
(12, 3);



