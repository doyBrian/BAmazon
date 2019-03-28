DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  Item_ID INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Product_Name VARCHAR(100) NOT NULL,
  Department_Name VARCHAR(100) NULL,
  Price DECIMAL(10, 2) NULL,
  Stock_Qty INT(10) NULL,
  Product_Sales DECIMAL(10, 2) NULL
);

INSERT INTO products (Product_Name, Department_Name, Price, Stock_Qty, Product_Sales)
VALUES ("Huggies Toilet Paper 12-pack", "Toiletries", 12.99, 9, 155.88);

INSERT INTO products (Product_Name, Department_Name, Price, Stock_Qty, Product_Sales)
VALUES ("Fancy Feast Grilled Wet Cat Food 24-pak", "Pet Supplies", 13.50, 4, 337.50);

INSERT INTO products (Product_Name, Department_Name, Price, Stock_Qty, Product_Sales)
VALUES ("Kellog's Frosted Flakes", "Grocery", 4.99, 2, 74.85);

INSERT INTO products (Product_Name, Department_Name, Price, Stock_Qty, Product_Sales)
VALUES ("Martha Stewart Down Comforter Queen", "Bedding", 129.99, 1, 649.95);

INSERT INTO products (Product_Name, Department_Name, Price, Stock_Qty, Product_Sales)
VALUES ("Windshield Wipers pair", "Automotive", 21, 6, 630);

INSERT INTO products (Product_Name, Department_Name, Price, Stock_Qty, Product_Sales)
VALUES ("Pantene Shampoo&Conditioner 24oz", "Toiletries", 7.50, 5, 375);

INSERT INTO products (Product_Name, Department_Name, Price, Stock_Qty, Product_Sales)
VALUES ("Greenies Salmon Flavor Treats", "Pet Supplies", 2.99, 7, 62.79);

INSERT INTO products (Product_Name, Department_Name, Price, Stock_Qty, Product_Sales)
VALUES ("Oreo Cookies pack", "Grocery", 2.25, 10, 20.25);

INSERT INTO products (Product_Name, Department_Name, Price, Stock_Qty, Product_Sales)
VALUES ("Memory Foam Pillow King", "Bedding", 49.99, 1, 499.9);

INSERT INTO products (Product_Name, Department_Name, Price, Stock_Qty, Product_Sales)
VALUES ("Car Freshener can (Lemon Scent)", "Automotive", 1.99, 3, 29.85);

INSERT INTO products (Product_Name, Department_Name, Price, Stock_Qty, Product_Sales)
VALUES ("Dove Bar Soap 6-pack", "Toiletries", 4.99, 4, 124.75);

INSERT INTO products (Product_Name, Department_Name, Price, Stock_Qty, Product_Sales)
VALUES ("Pooper Bags 4-ct", "Pet Supplies", 3.50, 15, 21);

INSERT INTO products (Product_Name, Department_Name, Price, Stock_Qty, Product_Sales)
VALUES ("Organics Whole Milk 1 Gallon", "Grocery", 2.50, 4, 62.50);

INSERT INTO products (Product_Name, Department_Name, Price, Stock_Qty, Product_Sales)
VALUES ("Duvet Set Queen", "Bedding", 65.99, 3, 461.93);

INSERT INTO products (Product_Name, Department_Name, Price, Stock_Qty, Product_Sales)
VALUES ("Turtle Car Wax 12oz", "Automotive", 15.00, 6, 45);

CREATE TABLE departments (
  Department_ID INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Department_Name VARCHAR(100) NULL,
  Overhead_Cost DECIMAL(10, 2) NULL
);

INSERT INTO departments (Department_Name, Overhead_Cost)
VALUES ("Toiletries", 1000);

INSERT INTO departments (Department_Name, Overhead_Cost)
VALUES ("Pet Supplies", 250);

INSERT INTO departments (Department_Name, Overhead_Cost)
VALUES ("Grocery", 100);

INSERT INTO departments (Department_Name, Overhead_Cost)
VALUES ("Bedding", 1000);

INSERT INTO departments (Department_Name, Overhead_Cost)
VALUES ("Automotive", 500);

SELECT * FROM products;

SELECT * FROM departments;

DROP TABLE departments;

DROP TABLE products;