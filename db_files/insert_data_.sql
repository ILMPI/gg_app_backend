USE `ggapp`;

-- Insert Users
INSERT INTO `users` (`password`, `name`, `email`, `image_url`, `state`)
VALUES 
('password1', 'Juan Pérez', 'juan.perez@example.com', 'https://picsum.photos/id/91/200/300', 'Active'),
('password2', 'María López', 'maria.lopez@example.com', 'https://picsum.photos/id/64/200/300', 'Active'),
('password3', 'Carlos García', 'carlos.garcia@example.com', 'https://picsum.photos/id/40/200/300', 'Active'),
('password4', 'Ana Fernández', 'ana.fernandez@example.com', 'https://picsum.photos/id/65/200/300', 'Active'),
('password5', 'Luis Martínez', 'luis.martinez@example.com', 'https://picsum.photos/id/63/200/300', 'Active'),
('password54', 'Marina Garcia', 'marina.garcia@example.com', 'https://picsum.photos/id/82/200/300', 'Active'),
('admin', 'admin', 'admin@gmail.com', 'https://picsum.photos/id//200/300', 'Active');

-- Insert Groups
INSERT INTO `groups` (`creator_id`, `title`, `description`, `image_url`, `created_on`)
VALUES 
((SELECT id FROM `users` WHERE name = 'Juan Pérez'), 'Grupo de Juan', 'Grupo creado por Juan Pérez', NULL, NOW()),
((SELECT id FROM `users` WHERE name = 'María López'), 'Grupo de María', 'Grupo creado por María López', NULL, NOW()),
((SELECT id FROM `users` WHERE name = 'Carlos García'), 'Grupo de Carlos', 'Grupo creado por Carlos García', NULL, NOW()),
((SELECT id FROM `users` WHERE name = 'Ana Fernández'), 'Grupo de Ana', 'Grupo creado por Ana Fernández', NULL, NOW()),
((SELECT id FROM `users` WHERE name = 'Luis Martínez'), 'Grupo de Luis', 'Grupo creado por Luis Martínez', NULL, NOW()),
((SELECT id FROM `users` WHERE email = 'admin@gmail.com'), 'Familia', 'Celebramos la abuela cumple 90!', 'https://placehold.co/200x200', NOW()),
((SELECT id FROM `users` WHERE email = 'admin@gmail.com'), 'Compañeros de EGB', 'Qué bien lo pasamos', '', NOW()),
((SELECT id FROM `users` WHERE email = 'admin@gmail.com'), 'Padel 2024', 'Padel domingueros 2024', '', NOW()),
((SELECT id FROM `users` WHERE email = 'admin@gmail.com'), 'Nuevo grupo', 'Descr grupo', '', NOW()),
((SELECT id FROM `users` WHERE email = 'admin@gmail.com'), 'Otro', 'Otro desc', '', NOW());

-- Insert Memberships
INSERT INTO `membership` (`users_id`, `groups_id`, `status`, `balance`)
VALUES 
-- Members for Grupo de Juan
((SELECT id FROM `users` WHERE name = 'María López'), (SELECT id FROM `groups` WHERE title = 'Grupo de Juan'), 'Joined', 0),
((SELECT id FROM `users` WHERE name = 'Carlos García'), (SELECT id FROM `groups` WHERE title = 'Grupo de Juan'), 'Joined', 0),
-- Members for Grupo de María
((SELECT id FROM `users` WHERE name = 'Juan Pérez'), (SELECT id FROM `groups` WHERE title = 'Grupo de María'), 'Joined', 0),
((SELECT id FROM `users` WHERE name = 'Ana Fernández'), (SELECT id FROM `groups` WHERE title = 'Grupo de María'), 'Joined', 0),
-- Members for Grupo de Carlos
((SELECT id FROM `users` WHERE name = 'Luis Martínez'), (SELECT id FROM `groups` WHERE title = 'Grupo de Carlos'), 'Joined', 0),
((SELECT id FROM `users` WHERE name = 'Ana Fernández'), (SELECT id FROM `groups` WHERE title = 'Grupo de Carlos'), 'Joined', 0),
-- Members for Grupo de Ana
((SELECT id FROM `users` WHERE name = 'Carlos García'), (SELECT id FROM `groups` WHERE title = 'Grupo de Ana'), 'Joined', 0),
((SELECT id FROM `users` WHERE name = 'Luis Martínez'), (SELECT id FROM `groups` WHERE title = 'Grupo de Ana'), 'Joined', 0),
-- Members for Grupo de Luis
((SELECT id FROM `users` WHERE name = 'Juan Pérez'), (SELECT id FROM `groups` WHERE title = 'Grupo de Luis'), 'Joined', 0),
((SELECT id FROM `users` WHERE name = 'María López'), (SELECT id FROM `groups` WHERE title = 'Grupo de Luis'), 'Joined', 0),
-- Member for Familia group
((SELECT id FROM `users` WHERE name = 'Marina Garcia'), (SELECT id FROM `groups` WHERE title = 'Familia'), 'Joined', 0);

-- Insert Expenses
INSERT INTO `expenses` (`groups_id`, `concept`, `amount`, `date`, `max_date`, `image_url`, `payer_user_id`, `created_on`)
VALUES 
-- Expenses for Grupo de Juan
((SELECT id FROM `groups` WHERE title = 'Grupo de Juan'), 'Compra de material', 100.50, NOW(), NULL, NULL, (SELECT id FROM `users` WHERE name = 'María López'), NOW()),
((SELECT id FROM `groups` WHERE title = 'Grupo de Juan'), 'Pago de servicio', 200.75, NOW(), NULL, NULL, (SELECT id FROM `users` WHERE name = 'Carlos García'), NOW()),

-- Expenses for Grupo de María
((SELECT id FROM `groups` WHERE title = 'Grupo de María'), 'Alquiler de sala', 150.00, NOW(), NULL, NULL, (SELECT id FROM `users` WHERE name = 'Juan Pérez'), NOW()),
((SELECT id FROM `groups` WHERE title = 'Grupo de María'), 'Compra de comida', 75.30, NOW(), NULL, NULL, (SELECT id FROM `users` WHERE name = 'Ana Fernández'), NOW()),

-- Expenses for Grupo de Carlos
((SELECT id FROM `groups` WHERE title = 'Grupo de Carlos'), 'Transporte', 50.00, NOW(), NULL, NULL, (SELECT id FROM `users` WHERE name = 'Luis Martínez'), NOW()),
((SELECT id FROM `groups` WHERE title = 'Grupo de Carlos'), 'Equipos de sonido', 300.00, NOW(), NULL, NULL, (SELECT id FROM `users` WHERE name = 'Ana Fernández'), NOW()),

-- Expenses for Grupo de Ana
((SELECT id FROM `groups` WHERE title = 'Grupo de Ana'), 'Decoraciones', 120.00, NOW(), NULL, NULL, (SELECT id FROM `users` WHERE name = 'Carlos García'), NOW()),
((SELECT id FROM `groups` WHERE title = 'Grupo de Ana'), 'Publicidad', 180.00, NOW(), NULL, NULL, (SELECT id FROM `users` WHERE name = 'Luis Martínez'), NOW()),

-- Expenses for Grupo de Luis
((SELECT id FROM `groups` WHERE title = 'Grupo de Luis'), 'Servicio de catering', 250.00, NOW(), NULL, NULL, (SELECT id FROM `users` WHERE name = 'Juan Pérez'), NOW()),
((SELECT id FROM `groups` WHERE title = 'Grupo de Luis'), 'Artículos promocionales', 90.00, NOW(), NULL, NULL, (SELECT id FROM `users` WHERE name = 'María López'), NOW());

-- Insert Expense Assignments
-- Assignments for Grupo de Juan
INSERT INTO `expense_assignments` (`users_id`, `expenses_id`, `group_id`, `cost`, `status`)
VALUES
((SELECT id FROM `users` WHERE name = 'María López'), (SELECT expense_id FROM `expenses` WHERE concept = 'Compra de material' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de Juan')), (SELECT id FROM `groups` WHERE title = 'Grupo de Juan'), 50.25, 'Reported'),
((SELECT id FROM `users` WHERE name = 'Carlos García'), (SELECT expense_id FROM `expenses` WHERE concept = 'Compra de material' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de Juan')), (SELECT id FROM `groups` WHERE title = 'Grupo de Juan'), 50.25, 'Reported'),

((SELECT id FROM `users` WHERE name = 'María López'), (SELECT expense_id FROM `expenses` WHERE concept = 'Pago de servicio' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de Juan')), (SELECT id FROM `groups` WHERE title = 'Grupo de Juan'), 100.375, 'Reported'),
((SELECT id FROM `users` WHERE name = 'Carlos García'), (SELECT expense_id FROM `expenses` WHERE concept = 'Pago de servicio' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de Juan')), (SELECT id FROM `groups` WHERE title = 'Grupo de Juan'), 100.375, 'Reported'),

-- Assignments for Grupo de María
((SELECT id FROM `users` WHERE name = 'Juan Pérez'), (SELECT expense_id FROM `expenses` WHERE concept = 'Alquiler de sala' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de María')), (SELECT id FROM `groups` WHERE title = 'Grupo de María'), 75.00, 'Reported'),
((SELECT id FROM `users` WHERE name = 'Ana Fernández'), (SELECT expense_id FROM `expenses` WHERE concept = 'Alquiler de sala' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de María')), (SELECT id FROM `groups` WHERE title = 'Grupo de María'), 75.00, 'Reported'),

((SELECT id FROM `users` WHERE name = 'Juan Pérez'), (SELECT expense_id FROM `expenses` WHERE concept = 'Compra de comida' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de María')), (SELECT id FROM `groups` WHERE title = 'Grupo de María'), 37.65, 'Reported'),
((SELECT id FROM `users` WHERE name = 'Ana Fernández'), (SELECT expense_id FROM `expenses` WHERE concept = 'Compra de comida' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de María')), (SELECT id FROM `groups` WHERE title = 'Grupo de María'), 37.65, 'Reported'),

-- Assignments for Grupo de Carlos
((SELECT id FROM `users` WHERE name = 'Luis Martínez'), (SELECT expense_id FROM `expenses` WHERE concept = 'Transporte' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de Carlos')), (SELECT id FROM `groups` WHERE title = 'Grupo de Carlos'), 25.00, 'Reported'),
((SELECT id FROM `users` WHERE name = 'Ana Fernández'), (SELECT expense_id FROM `expenses` WHERE concept = 'Transporte' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de Carlos')), (SELECT id FROM `groups` WHERE title = 'Grupo de Carlos'), 25.00, 'Reported'),

((SELECT id FROM `users` WHERE name = 'Luis Martínez'), (SELECT expense_id FROM `expenses` WHERE concept = 'Equipos de sonido' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de Carlos')), (SELECT id FROM `groups` WHERE title = 'Grupo de Carlos'), 150.00, 'Reported'),
((SELECT id FROM `users` WHERE name = 'Ana Fernández'), (SELECT expense_id FROM `expenses` WHERE concept = 'Equipos de sonido' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de Carlos')), (SELECT id FROM `groups` WHERE title = 'Grupo de Carlos'), 150.00, 'Reported'),

-- Assignments for Grupo de Ana
((SELECT id FROM `users` WHERE name = 'Carlos García'), (SELECT expense_id FROM `expenses` WHERE concept = 'Decoraciones' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de Ana')), (SELECT id FROM `groups` WHERE title = 'Grupo de Ana'), 60.00, 'Reported'),
((SELECT id FROM `users` WHERE name = 'Luis Martínez'), (SELECT expense_id FROM `expenses` WHERE concept = 'Decoraciones' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de Ana')), (SELECT id FROM `groups` WHERE title = 'Grupo de Ana'), 60.00, 'Reported'),

((SELECT id FROM `users` WHERE name = 'Carlos García'), (SELECT expense_id FROM `expenses` WHERE concept = 'Publicidad' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de Ana')), (SELECT id FROM `groups` WHERE title = 'Grupo de Ana'), 90.00, 'Reported'),
((SELECT id FROM `users` WHERE name = 'Luis Martínez'), (SELECT expense_id FROM `expenses` WHERE concept = 'Publicidad' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de Ana')), (SELECT id FROM `groups` WHERE title = 'Grupo de Ana'), 90.00, 'Reported'),

-- Assignments for Grupo de Luis
((SELECT id FROM `users` WHERE name = 'Juan Pérez'), (SELECT expense_id FROM `expenses` WHERE concept = 'Servicio de catering' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de Luis')), (SELECT id FROM `groups` WHERE title = 'Grupo de Luis'), 125.00, 'Reported'),
((SELECT id FROM `users` WHERE name = 'María López'), (SELECT expense_id FROM `expenses` WHERE concept = 'Servicio de catering' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de Luis')), (SELECT id FROM `groups` WHERE title = 'Grupo de Luis'), 125.00, 'Reported'),

((SELECT id FROM `users` WHERE name = 'Juan Pérez'), (SELECT expense_id FROM `expenses` WHERE concept = 'Artículos promocionales' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de Luis')), (SELECT id FROM `groups` WHERE title = 'Grupo de Luis'), 45.00, 'Reported'),
((SELECT id FROM `users` WHERE name = 'María López'), (SELECT expense_id FROM `expenses` WHERE concept = 'Artículos promocionales' AND groups_id = (SELECT id FROM `groups` WHERE title = 'Grupo de Luis')), (SELECT id FROM `groups` WHERE title = 'Grupo de Luis'), 45.00, 'Reported');
