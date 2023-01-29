INSERT INTO department (department_name)
VALUES ('Management'),
       ('Finance'),
       ('Sales'),
       ('Engineering'),
       ('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES ('Manager', 130000, 01),
       ('Accountant', 105000, 02),
       ('Business Analyst', 95000, 03),
       ('Engineer', 120000, 04),
       ('HR coordinator', 90000, 05);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Joe', 'Brott', 1, null),
       ('Justin', 'Frumman', 2, 1),
       ('Lauren', 'Montosae', 3, 1),
       ('Kayleen', 'Sagonde', 4, 1),
       ('Roni', 'Jole', 5, 1);
