-- Insert 5 users with Spanish names
INSERT INTO `users` (`password`, `name`, `email`, `image_url`, `state`)
VALUES 
('password1', 'Juan Pérez', 'juan.perez@example.com', NULL, 'Active'),
('password2', 'María López', 'maria.lopez@example.com', NULL, 'Active'),
('password3', 'Carlos García', 'carlos.garcia@example.com', NULL, 'Active'),
('password4', 'Ana Fernández', 'ana.fernandez@example.com', NULL, 'Active'),
('password5', 'Luis Martínez', 'luis.martinez@example.com', NULL, 'Active');
-- Insert 5 groups, each created by one of the 5 users
INSERT INTO `groups` (`creator_id`, `title`, `description`, `image_url`, `created_on`)
VALUES 
((SELECT id FROM `users` WHERE name = 'Juan Pérez'), 'Grupo de Juan', 'Grupo creado por Juan Pérez', NULL, NOW()),
((SELECT id FROM `users` WHERE name = 'María López'), 'Grupo de María', 'Grupo creado por María López', NULL, NOW()),
((SELECT id FROM `users` WHERE name = 'Carlos García'), 'Grupo de Carlos', 'Grupo creado por Carlos García', NULL, NOW()),
((SELECT id FROM `users` WHERE name = 'Ana Fernández'), 'Grupo de Ana', 'Grupo creado por Ana Fernández', NULL, NOW()),
((SELECT id FROM `users` WHERE name = 'Luis Martínez'), 'Grupo de Luis', 'Grupo creado por Luis Martínez', NULL, NOW());
-- Insert memberships for each group
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
((SELECT id FROM `users` WHERE name = 'María López'), (SELECT id FROM `groups` WHERE title = 'Grupo de Luis'), 'Joined', 0);
-- Insert expenses for each group
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
