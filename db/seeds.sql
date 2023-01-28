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
       ('Engineer', 120000, 01),
       ('HR coordinator', 90000, 01);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Joe', 'Brott', 001, null),
       ('Justin', 'Frumman', 002, 01),
       ('Lauren', 'Montosae', 003, 01),
       ('Kayleen', 'Sagonde', 004, 01),
       ('Roni', 'Jole', 005, 01);

-- role.salary FROM employee