SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `materials`;
DROP TABLE IF EXISTS `accessory_item_types`;
DROP TABLE IF EXISTS `accessory_items`;
DROP TABLE IF EXISTS `product_items`;

CREATE TABLE categories (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64)
);

CREATE TABLE materials (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(64)
);


CREATE TABLE accessory_item_types (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(64),
	category_id INT,
	FOREIGN KEY (category_id) REFERENCES categories(id)
);


CREATE TABLE accessory_items (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name TEXT,
	accessory_type_id INT,
	material_id INT,
	FOREIGN KEY (accessory_type_id) REFERENCES accessory_item_types(id),
	FOREIGN KEY (material_id) REFERENCES materials(id)
);

 CREATE TABLE product_items (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name TEXT,
	category_id INT,
	material_id INT,
	FOREIGN KEY (category_id) REFERENCES categories(id),
	FOREIGN KEY (material_id) REFERENCES materials(id)
 );

SET FOREIGN_KEY_CHECKS=1;