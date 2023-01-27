INSERT INTO departments (department_name)
VALUES ('Marketing'),
       ('Finance'),
       ('Sales'),
       ('Engineering'),
       ('Human Resources');

INSERT INTO roles (title, salary, department_id)
VALUES ('Marketing Agent', 100000, 1),
       ('Accountant', 105000, 2),
       ('Business Analyst', 95000, 3),
       ('Engineer', 120000, 4),
       ('HR coordinator', 90000, 5),

INSERT INTO employees (first_name, last_name, role_id, managers_id)
VALUES ('Joe', 'Brott', 1, 11),
       ('Justin', 'Frumman' 2, 12),
       ('Lauren', 'Montosae', 3, 11),
       ('Kayleen', 'Sagonde', 4, 14),
       ('Roni', 'Jole', 5, 15),
