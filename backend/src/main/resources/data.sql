create or replace view employee_view
as
select e.id as id, concat(e.first_name, ' ', e.last_name) as name
from employee e;

create or replace view employee_service_view
as
select s.id as id, s.name as name, e.id as employee_id
from service s
         join employee_service es on s.id = es.service_id
         join employee e on e.id = es.employee_id;
