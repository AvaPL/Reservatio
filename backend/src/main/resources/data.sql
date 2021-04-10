create or replace view service_provider_employees_view
as
select sp.id
from service_provider sp;

create or replace view service_provider_service_view
as
select s.id, s.name, s.service_provider_id
from service s;

create or replace view employee_view
as
select e.id as id, e.first_name, e.last_name, e.service_provider_id
from employee e;

create or replace view employee_service_view
as
select s.id as id, s.name as name, e.id as employee_id
from service s
         join employee_service es on s.id = es.service_id
         join employee e on e.id = es.employee_id;


