INSERT INTO department (department_name)
VALUES ('Marketing'),
       ('Finance'),
       ('Sales'),
       ('Engineering'),
       ('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES ('Marketing Agent', 100000, 01),
       ('Accountant', 105000, 02),
       ('Business Analyst', 95000, 03),
       ('Engineer', 120000, 04),
       ('HR coordinator', 90000, 05);

INSERT INTO employee (first_name, last_name, role_id, managers_id)
VALUES ('Joe', 'Brott', 001, 11),
       ('Justin', 'Frumman', 002, 12),
       ('Lauren', 'Montosae', 003, 11),
       ('Kayleen', 'Sagonde', 004, 14),
       ('Roni', 'Jole', 005, 15);