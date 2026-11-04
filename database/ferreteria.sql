-- =============================================
-- BASE DE DATOS: FERRETERÍA
-- =============================================
DROP DATABASE IF EXISTS ferreteria_db;
CREATE DATABASE ferreteria_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE ferreteria_db;

-- ---------------------------------------------
-- TABLA: categorias
-- ---------------------------------------------
CREATE TABLE categorias (
    id_categoria INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL,
    PRIMARY KEY (id_categoria),
    UNIQUE (nombre)
) ENGINE = InnoDB;

-- ---------------------------------------------
-- TABLA: productos
-- ---------------------------------------------
CREATE TABLE productos (
    id_producto INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    id_categoria INT NOT NULL,
    PRIMARY KEY (id_producto),
    CONSTRAINT fk_productos_categorias
        FOREIGN KEY (id_categoria)
        REFERENCES categorias (id_categoria)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT chk_precio CHECK (precio >= 0),
    CONSTRAINT chk_stock CHECK (stock >= 0)
) ENGINE = InnoDB;

-- ---------------------------------------------
-- DATOS DE PRUEBA
-- ---------------------------------------------
INSERT INTO categorias (nombre, descripcion) VALUES
('Herramientas manuales', 'Martillos, destornilladores, alicates y llaves'),
('Herramientas eléctricas', 'Taladros, amoladoras y sierras eléctricas'),
('Pinturas', 'Pinturas, brochas, rodillos y solventes'),
('Electricidad', 'Cables, enchufes, focos e interruptores'),
('Plomería', 'Tubos, llaves de paso y accesorios de agua');

INSERT INTO productos (nombre, descripcion, precio, stock, id_categoria) VALUES
('Martillo de carpintero', 'Mango de madera, 16 oz', 45.50, 20, 1),
('Destornillador plano', 'Punta de acero 6 mm', 12.00, 50, 1),
('Alicate universal', 'Mango aislado de 8 pulgadas', 35.00, 30, 1),
('Taladro percutor', '650 W con maletín', 380.00, 8, 2),
('Amoladora angular', '4 1/2 pulgadas, 850 W', 320.00, 5, 2),
('Pintura látex blanca', 'Galón de 4 litros', 95.00, 25, 3),
('Brocha de 3 pulgadas', 'Cerda natural', 15.00, 40, 3),
('Cable eléctrico 2.5 mm', 'Rollo de 100 metros', 250.00, 10, 4),
('Foco LED 9W', 'Luz blanca, rosca E27', 10.00, 100, 4),
('Tubo PVC 1/2 pulgada', 'Barra de 6 metros', 28.00, 60, 5);