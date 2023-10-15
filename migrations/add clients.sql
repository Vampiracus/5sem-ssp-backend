INSERT client(login, password, name, address, phone) VALUES('a', '12345678', 'Ая', '1-я ул., 123 мкр. az', '+123495678');
INSERT client(login, password, name, address, phone) VALUES('b', '12345678', 'Ая', '1-я ул., 123 мкр. az', '+123495678');

INSERT manager(login, password, name) VALUES('a', '12345678', 'a');
INSERT manager(login, password, name) VALUES('c', '12345678', 'a');

INSERT _order(total, status, client_login) VALUES(0, 'created', 'a');

INSERT product(name, cost) VALUES('pr1', 123);

INSERT order_item(product_count, order_id, product_id) VALUES(1, 1, 1);

INSERT session(user_type, cookie, manager_login, client_login, start_date, expiration_date)
VALUES('manager', '1234', NULL, 'b', '09.03.2005', '10.03.2005');

INSERT shipment(date, shipped_count, manager_login, order_item_id)
VALUES('09.03.2005', 1, 'c', 1);