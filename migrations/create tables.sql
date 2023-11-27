CREATE TABLE client
(
	login 			VARCHAR(20) PRIMARY KEY,
	CONSTRAINT login_latin_or_digits CHECK (login REGEXP '^[A-Za-z0-9\\-_]+$'),
	password 		VARCHAR(20) NOT NULL,
	CONSTRAINT password_long_enough CHECK (LENGTH(password) >= 8),
	name			 VARCHAR(100) NOT NULL,
	CONSTRAINT name_latin_or_russian CHECK (name REGEXP '^[A-Za-zА-ЯЁа-яё \\-\\\']+$'),
	address         	VARCHAR(100) NOT NULL,
	CONSTRAINT address_latin_or_russian CHECK (address REGEXP '^[A-Za-zА-ЯЁа-яё0-9\\.\\, \\-\\\']+$'),
	phone           	VARCHAR(15) NOT NULL,
	CONSTRAINT phone_constraint CHECK (phone REGEXP '^\\+?[0-9]{8,14}$')
);

CREATE TABLE manager
(
	login                VARCHAR(20) PRIMARY KEY,
	CONSTRAINT manager_login_latin_or_digits CHECK (login REGEXP '^[A-Za-z0-9\\-_]+$'),
	password             VARCHAR(20) NOT NULL,
	CONSTRAINT manager_password_long_enough CHECK (LENGTH(password) >= 8),
	name                 VARCHAR(100) NOT NULL,
	CONSTRAINT manager_name_latin_or_russian CHECK (name REGEXP '^[A-Za-zА-ЯЁа-яё \\-\\\']+$')
);

CREATE TABLE _order
(
	id                   INTEGER PRIMARY KEY AUTO_INCREMENT,
	total                INTEGER NOT NULL,
	CONSTRAINT total_greater_than_0 CHECK (total >= 0),
	contract             VARCHAR(20),
	contract_date        TIMESTAMP,
	status               VARCHAR(40) NOT NULL,
	CONSTRAINT valid_status CHECK ( status IN ('created', 'processing (no contract)', 'waiting for changes', 'processing (no signature)', 'processing', 'cancelled', 'ready', 'finished') ),
	client_login         VARCHAR(20) NOT NULL,
	FOREIGN KEY (client_login) REFERENCES client (login),
	manager_login        VARCHAR(20),
	FOREIGN KEY (manager_login) REFERENCES manager (login)
);

CREATE TABLE product
(
	id                   INTEGER PRIMARY KEY AUTO_INCREMENT,
	name                 VARCHAR(20) NOT NULL,
	CONSTRAINT product_name_latin_or_russian_ CHECK (name REGEXP '^[A-Za-zА-ЯЁа-яё0-9\\.\\, \\-\\\']+$'),
	cost                 INTEGER NOT NULL,
	CONSTRAINT cost_greater_than_0 CHECK (cost >= 0)
);

CREATE TABLE order_item
(
	id                   INTEGER PRIMARY KEY AUTO_INCREMENT,
	product_count        INTEGER NOT NULL,
	CONSTRAINT product_greater_than_0 CHECK (product_count >= 0),
	order_id             INTEGER NOT NULL,
	FOREIGN KEY (order_id) REFERENCES _order (id),
	product_id           INTEGER NOT NULL,
	FOREIGN KEY (product_id) REFERENCES product (id),
	UNIQUE(order_id, product_id)
);

CREATE TABLE session
(
	user_type            VARCHAR(20) NOT NULL,
	CONSTRAINT user_types CHECK ( user_type IN ('manager', 'client') ),
	cookie               VARCHAR(50) PRIMARY KEY,
	manager_login        VARCHAR(20),
	FOREIGN KEY (manager_login) REFERENCES manager (login),
	client_login         VARCHAR(20),
	FOREIGN KEY (client_login) REFERENCES client (login),
	CONSTRAINT user_not_null CHECK (( manager_login IS NOT NULL and client_login IS NULL) OR (client_login IS NOT NULL and manager_login IS NULL)),
	start_date           TIMESTAMP NOT NULL,
	expiration_date      TIMESTAMP NOT NULL
);

CREATE TABLE shipment
(
	id                   INTEGER PRIMARY KEY AUTO_INCREMENT,
	date                 TIMESTAMP NOT NULL,
	shipped_count        INTEGER NOT NULL,
	CONSTRAINT shipped_more_than_0 CHECK (shipped_count > 0),
	manager_login        VARCHAR(20) NOT NULL,
	FOREIGN KEY (manager_login) REFERENCES manager (login),
	order_item_id        INTEGER NOT NULL,
	FOREIGN KEY (order_item_id) REFERENCES order_item (id)
);
