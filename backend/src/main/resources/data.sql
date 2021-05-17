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

create or replace view salon_view
as
select sp.id as id, sp.name as name, sp.phone_number as phone_nr, sp.email as email, a.street as street,
       a.property_number as property_nr, a.city as city, a.post_code as post_code
from service_provider sp
    join address a on a.id = sp.address_id;

create or replace view booking_view
as
select sp.id as id, sp.name as name, a.city as city, a.street as street, a.property_number as property_nr
from service_provider sp
    join address a on sp.address_id = a.id;

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
create or replace view booking_services_view
as
select s.id as id, s.name as name, s.price as price, s.service_provider_id as service_provider_id
from service s;

create or replace view booking_service_view
as
select s.id as id, s.service_provider_id as service_provider_id
from service s;

create or replace view booking_reservation_view
as
select r.id as id, r.service_id as service_id, r2.grade as grade, r2.message as message, c.first_name as first_name, c.last_name as last_name
from reservation r
    join review r2 on r.id = r2.reservation_id
    join customer c on r.customer_id = c.id;