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
select s.id as id, s.name as name, s.price_usd as price, s.service_provider_id as service_provider_id
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

create or replace view customer_reservation_view
as
select c.id as id
from customer c;

create or replace view reservation_view
as
select r.id as id, r.date_time as date_time, sp.name as provider_name, s.name as service_name, s.duration_minutes as duration, r.customer_id as customer_id
from reservation r
         join service s on r.service_id = s.id
         join service_provider sp on s.service_provider_id = sp.id;

create or replace view favourite_view
as
select sp.id as id, count(*) as number
from service_provider sp
    join favourites f on sp.id = f.service_provider_id
    group by sp.id

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