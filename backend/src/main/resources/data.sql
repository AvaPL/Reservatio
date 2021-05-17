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


-- services views
create
or replace view service_provider_services_view
as
select sp.id
from service_provider sp;

create
or replace view service_provider_employee_view
as
select e.id, concat(e.first_name, ' ', e.last_name) as name, e.service_provider_id
from employee e;

create
or replace view service_view
as
select s.id, s.name, s.description, s.price_usd, s.duration_minutes, s.service_provider_id
from service s;

create
or replace view service_employee_view
as
select e.id, concat(e.first_name, ' ', e.last_name) as name, s.id as service_id
from employee e
         join employee_service es on e.id = es.employee_id
         join service s on s.id = es.service_id;

create or replace view service_providers_view
as
select sp.id as id, sp.name as service_provider_name, sp.image_url as image_url, a.city as city, average.average_grade as average_grade
from service_provider sp
         join address a on a.id = sp.address_id
         join (select s.service_provider_id as service_provider_id, AVG(r2.grade) as average_grade
               from service s
                        join reservation r on s.id = r.service_id
                        join review r2 on r.id = r2.reservation_id
               group by s.service_provider_id) average on service_provider_id = sp.id