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



create or replace view customer_reservation_view
as
select c.id as id
from customer c;

create or replace view reservation_view
as
select r.id as id, r.date_time as date_time, sp.name as provider_name, s.name as service_name, s.duration as duration, r.customer_id as customer_id, r.review_id as review_id
from reservation r
         join service s on r.service_id = s.id
         join service_provider sp on s.service_provider_id = sp.id

