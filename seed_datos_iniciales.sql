BEGIN;

-- Script general de datos iniciales para pruebas del sistema.
-- Contraseñas (BCrypt):
--   admin123
--   operador123

-- Roles
INSERT INTO roles (nombre) VALUES ('ADMIN') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO roles (nombre) VALUES ('OPERADOR') ON CONFLICT (nombre) DO NOTHING;

-- Tipos de vehiculo
INSERT INTO tipos_vehiculo (nombre) VALUES ('CARRO') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO tipos_vehiculo (nombre) VALUES ('MOTO') ON CONFLICT (nombre) DO NOTHING;

-- Estados de espacio
INSERT INTO estados_espacio (nombre) VALUES ('LIBRE') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO estados_espacio (nombre) VALUES ('OCUPADO') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO estados_espacio (nombre) VALUES ('RESERVADO') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO estados_espacio (nombre) VALUES ('MANTENIMIENTO') ON CONFLICT (nombre) DO NOTHING;

-- Estados de ticket
INSERT INTO estados_ticket (nombre) VALUES ('ACTIVO') ON CONFLICT (nombre) DO NOTHING;
INSERT INTO estados_ticket (nombre) VALUES ('CERRADO') ON CONFLICT (nombre) DO NOTHING;

-- Usuarios base
INSERT INTO usuarios (username, nombre, password, rol_id, activo, eliminado, fecha_creacion, fecha_eliminacion)
VALUES (
    'admin',
    'Administrador',
    '$2a$10$VufadKFm1fm/8GKTIn87MugS.QyQbs3WXm3/s84nbtLF1dy1Po7L2',
    (SELECT id FROM roles WHERE nombre = 'ADMIN'),
    true,
    false,
    NOW(),
    NULL
) ON CONFLICT (username) DO NOTHING;

INSERT INTO usuarios (username, nombre, password, rol_id, activo, eliminado, fecha_creacion,fecha_eliminacion)
VALUES (
    'operador',
    'Operador',
    '$2a$10$I045ZWAtaN1EyWYNIUxN7ec3kVm4hRkzl3X47j.gdLSc97HnbCMfW',
    (SELECT id FROM roles WHERE nombre = 'OPERADOR'),
    true,
    false,
    NOW()
    ,NULL
) ON CONFLICT (username) DO NOTHING;

-- Espacios base
INSERT INTO espacios (codigo_espacio, tipo_vehiculo_id, estado_id, activo)
VALUES (
    'C-001',
    (SELECT id FROM tipos_vehiculo WHERE nombre = 'CARRO'),
    (SELECT id FROM estados_espacio WHERE nombre = 'OCUPADO'),
    true
) ON CONFLICT (codigo_espacio) DO NOTHING;

INSERT INTO espacios (codigo_espacio, tipo_vehiculo_id, estado_id, activo)
VALUES (
    'C-002',
    (SELECT id FROM tipos_vehiculo WHERE nombre = 'CARRO'),
    (SELECT id FROM estados_espacio WHERE nombre = 'LIBRE'),
    true
) ON CONFLICT (codigo_espacio) DO NOTHING;

INSERT INTO espacios (codigo_espacio, tipo_vehiculo_id, estado_id, activo)
VALUES (
    'M-001',
    (SELECT id FROM tipos_vehiculo WHERE nombre = 'MOTO'),
    (SELECT id FROM estados_espacio WHERE nombre = 'LIBRE'),
    true
) ON CONFLICT (codigo_espacio) DO NOTHING;

-- Ticket activo de prueba para visualizar ticketActivo en listado de espacios.
INSERT INTO tickets (
    codigo_ticket,
    placa,
    tipo_vehiculo_id,
    espacio_id,
    hora_entrada,
    estado_id,
    creado_por
)
VALUES (
    'T-0001',
    'ABC123',
    (SELECT id FROM tipos_vehiculo WHERE nombre = 'CARRO'),
    (SELECT id FROM espacios WHERE codigo_espacio = 'C-001'),
    NOW() - INTERVAL '30 minutes',
    (SELECT id FROM estados_ticket WHERE nombre = 'ACTIVO'),
    (SELECT id FROM usuarios WHERE username = 'admin')
) ON CONFLICT (codigo_ticket) DO NOTHING;

COMMIT;
