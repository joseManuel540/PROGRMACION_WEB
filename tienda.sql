SET NAMES utf8mb4;

CREATE DATABASE tienda;
USE tienda;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL DEFAULT 0
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'usuario'
);

INSERT INTO productos (nombre, precio, stock) 
VALUES ('Teclado', 80000, 10), ('Mouse', 35000, 25);

