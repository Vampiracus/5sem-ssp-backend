INSERT client(login, password, name, address, phone) VALUES('a', '12345678', 'Иванов И И', '1-я ул., 123 мкр., д. 2e', '+123495678');
INSERT client(login, password, name, address, phone) VALUES('b', '12345678', 'Петров П П', '1-я ул., 123 мкр., д. 2e', '+123495678');

INSERT manager(login, password, name) VALUES('a', '12345678', 'Васильев В В');
INSERT manager(login, password, name) VALUES('c', '12345678', 'Дмитриев Д Д');

#INSERT _order(total, status, client_login) VALUES(0, 'created', 'a');

INSERT product(name, cost) VALUES('Стул', 50000);

#INSERT order_item(product_count, order_id, product_id) VALUES(2, 1, 1);

INSERT session(user_type, cookie, manager_login, client_login, start_date, expiration_date)
VALUES('manager', '1234', NULL, 'b', '09.03.2005', '10.03.2005');

#INSERT shipment(date, shipped_count, manager_login, order_item_id)
#VALUES('09.03.2005', 1, 'c', 1);
