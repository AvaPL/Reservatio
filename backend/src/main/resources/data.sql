create or replace view reservation_view
as
select r.id as id, r.date_time as date_time, sp.name as provider_name, s.name as service_name, s.duration as duration
from reservation r
    join service s on r.service_id = s.id
    join service_provider sp on s.service_provider_id = sp.id