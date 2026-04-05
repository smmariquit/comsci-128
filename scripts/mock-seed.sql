begin; -- ACID
-- atomicity: all of the insert statements below will be treated as a single unit. if any statement fails, the entire transaction will be rolled back to maintain data integrity.
-- consistency: the insert statements are designed to maintain the consistency of the database by ensuring that all foreign key relationships are respected and that there are no duplicate entries.
-- isolation: by using a transaction, we ensure that the changes made by these insert statements are not visible to other transactions until the transaction is committed, preventing issues like dirty reads.
-- durability: once the transaction is committed, the changes made by these insert statements will be permanently saved in the database, even in the event of a system failure.

-- 
insert into public."user" (
  account_email,
  first_name,
  middle_name,
  last_name,
  password,
  sex,
  user_type,
  contact_email,
  phone_number,
  birthday,
  home_address,
  is_deleted
)
values
    -- hash is the hash value of the password. 
    -- for the sake of this mock data, we are using a placeholder value "demo_hash_[user_type]" to represent the hashed password for each user type.
  ('jelindo@up.edu.ph', 'Joella', null, 'Elindo', 'demo_hash_sysadmin', 'Female', 'System Admin', 'jelindo@up.edu.ph', '09171230001', '1988-05-14', 'UPLB Campus, Los Banos, Laguna', false),
  ('ygprudencio@up.edu.ph', 'Yhannis', 'Geosh', 'Prudencio', 'demo_hash_manager1', 'Male', 'Manager', 'ygprudencio@up.edu.ph', '09171230002', '1984-02-08', 'F.O. Santos, Los Banos, Laguna', false),
  ('peter.centeno@gmail.com', 'Peter', 'Jehmuel', 'Centeno', 'demo_hash_manager2', 'Male', 'Manager', 'peter.centeno@gmail.com', '09171230003', '1981-09-22', 'Batong Malake, Los Banos, Laguna', false),
  ('acalagui@up.edu.ph', 'Angelica', null, 'Calagui', 'demo_hash_student1', 'Female', 'Student', 'acalagui@up.edu.ph', '09171230011', '2005-01-04', 'Calamba, Laguna', false),
  ('ardalupan@up.edu.ph', 'Angelo', 'Rene', 'Dalupan', 'demo_hash_student2', 'Male', 'Student', 'ardalupan@up.edu.ph', '09171230012', '2004-07-16', 'San Pablo, Laguna', false),
  ('gjapolinar@up.edu.ph', 'Giovann', 'Josh', 'Apolinar', 'demo_hash_student3', 'Male', 'Student', 'gjapolinar@up.edu.ph', '09171230013', '2003-11-02', 'Sta. Cruz, Laguna', false),
  ('sganot@up.edu.ph', 'Sophia', 'Reign', 'Ganot', 'demo_hash_student4', 'Female', 'Student', 'sganot@up.edu.ph', '09171230014', '2005-03-30', 'Bay, Laguna', false)
on conflict (account_email) do nothing; -- if all users in the above list dont already exist, insert. else, skip to avoid duplicates.

insert into public."user" (
  account_email,
  first_name,
  middle_name,
  last_name,
  password,
  sex,
  user_type,
  contact_email,
  phone_number,
  birthday,
  home_address,
  is_deleted
)
values
  ('jagarcia@up.edu.ph', 'James', 'Anthony', 'Garcia', 'demo_hash_manager3', 'Male', 'Manager', 'jagarcia@up.edu.ph', '09171230015', '1987-06-21', 'Los Banos, Laguna', false),
  ('jcorpuz@up.edu.ph', 'Jelen', null, 'Corpuz', 'demo_hash_student5', 'Female', 'Student', 'jcorpuz@up.edu.ph', '09171230016', '2004-02-10', 'Calauan, Laguna', false),
  ('jpagbilao@up.edu.ph', 'Jerome', null, 'Pagbilao', 'demo_hash_student6', 'Male', 'Student', 'jpagbilao@up.edu.ph', '09171230017', '2004-09-18', 'Bay, Laguna', false),
  ('jpagcaliwagan@up.edu.ph', 'Joshua', null, 'Pagcaliwagan', 'demo_hash_student7', 'Male', 'Student', 'jpagcaliwagan@up.edu.ph', '09171230018', '2005-01-25', 'Pila, Laguna', false),
  ('lfernandez@up.edu.ph', 'Luthelle', null, 'Fernandez', 'demo_hash_student8', 'Female', 'Student', 'lfernandez@up.edu.ph', '09171230019', '2004-12-03', 'Rizal, Laguna', false),
  ('nccordero@up.edu.ph', 'Nicole', 'Claire', 'Cordero', 'demo_hash_student9', 'Female', 'Student', 'nccordero@up.edu.ph', '09171230020', '2005-04-14', 'Calamba, Laguna', false),
  ('phfababeir@up.edu.ph', 'Paul', 'Hadley', 'Fababeir', 'demo_hash_student10', 'Male', 'Student', 'phfababeir@up.edu.ph', '09171230021', '2004-05-27', 'Los Banos, Laguna', false),
  ('pmjamolod@up.edu.ph', 'Phea', 'Marie', 'Jamolod', 'demo_hash_student11', 'Female', 'Student', 'pmjamolod@up.edu.ph', '09171230022', '2004-10-09', 'Los Banos, Laguna', false),
  ('rdrebugio@up.edu.ph', 'Robin', 'Drey', 'Rebugio', 'demo_hash_student12', 'Male', 'Student', 'rdrebugio@up.edu.ph', '09171230023', '2004-08-11', 'Bay, Laguna', false),
  ('vgaquino@up.edu.ph', 'Vince', 'Gabriel', 'Aquino', 'demo_hash_student13', 'Male', 'Student', 'vgaquino@up.edu.ph', '09171230024', '2003-12-19', 'Los Banos, Laguna', false),
  ('zsilerio@up.edu.ph', 'Zel', null, 'Silerio', 'demo_hash_student14', 'Male', 'Student', 'zsilerio@up.edu.ph', '09171230025', '2004-03-08', 'Calamba, Laguna', false)
on conflict (account_email) do nothing;

-- housing admins and landlords are also managers, so we need to insert them into the manager table as well.
-- the email is the identifier of the user
insert into public.manager (account_number, manager_type)
select u.account_number, 'Housing Administrator'
from public."user" u
where u.account_email = 'ygprudencio@up.edu.ph'
on conflict (account_number) do nothing;

insert into public.manager (account_number, manager_type)
select u.account_number, 'Housing Administrator'
from public."user" u
where u.account_email = 'jagarcia@up.edu.ph'
on conflict (account_number) do nothing;

insert into public.housing_admin (account_number)
select m.account_number
from public.manager m
join public."user" u on u.account_number = m.account_number
where u.account_email = 'jagarcia@up.edu.ph'
on conflict (account_number) do nothing;

insert into public.manager (account_number, manager_type)
select u.account_number, 'Housing Administrator'
from public."user" u
where u.account_email = 'jelindo@up.edu.ph'
on conflict (account_number) do nothing;

insert into public.manager (account_number, manager_type)
select u.account_number, 'Landlord'
from public."user" u
where u.account_email = 'peter.centeno@gmail.com'
on conflict (account_number) do nothing;

insert into public.system_admin (account_number)
select m.account_number
from public.manager m
join public."user" u on u.account_number = m.account_number
where u.account_email = 'jelindo@up.edu.ph'
on conflict (account_number) do nothing;

insert into public.housing_admin (account_number)
select m.account_number
from public.manager m
join public."user" u on u.account_number = m.account_number
where u.account_email = 'ygprudencio@up.edu.ph'
on conflict (account_number) do nothing;

insert into public.landlord (account_number)
select m.account_number
from public.manager m
join public."user" u on u.account_number = m.account_number
where u.account_email = 'peter.centeno@gmail.com'
on conflict (account_number) do nothing;

insert into public.student (
  account_number,
  student_number,
  housing_status,
  emergency_contact_name,
  emergency_contact_number,
  emergency_contact_relationship
)
select u.account_number, 2023010001, 'Assigned', 'Lorna Calagui', '09181230021', 'Mother'
from public."user" u
where u.account_email = 'acalagui@up.edu.ph'
on conflict (student_number) do nothing;

insert into public.student (
  account_number,
  student_number,
  housing_status,
  emergency_contact_name,
  emergency_contact_number,
  emergency_contact_relationship
)
select u.account_number, 2023010002, 'Assigned', 'Edwin Dalupan', '09181230022', 'Father'
from public."user" u
where u.account_email = 'ardalupan@up.edu.ph'
on conflict (student_number) do nothing;

insert into public.student (
  account_number,
  student_number,
  housing_status,
  emergency_contact_name,
  emergency_contact_number,
  emergency_contact_relationship
)
select u.account_number, 2023010003, 'Not Assigned', 'Nina Apolinar', '09181230023', 'Mother'
from public."user" u
where u.account_email = 'gjapolinar@up.edu.ph'
on conflict (student_number) do nothing;

insert into public.student (
  account_number,
  student_number,
  housing_status,
  emergency_contact_name,
  emergency_contact_number,
  emergency_contact_relationship
)
select u.account_number, 2023010004, 'Not Assigned', 'Leo Ganot', '09181230024', 'Father'
from public."user" u
where u.account_email = 'sganot@up.edu.ph'
on conflict (student_number) do nothing;

insert into public.student (
  account_number,
  student_number,
  housing_status,
  emergency_contact_name,
  emergency_contact_number,
  emergency_contact_relationship
)
select u.account_number, 2023010005, 'Not Assigned', 'Mila Corpuz', '09181230025', 'Mother'
from public."user" u
where u.account_email = 'jcorpuz@up.edu.ph'
on conflict (student_number) do nothing;

insert into public.student (
  account_number,
  student_number,
  housing_status,
  emergency_contact_name,
  emergency_contact_number,
  emergency_contact_relationship
)
select u.account_number, 2023010006, 'Assigned', 'Lorna Pagbilao', '09181230026', 'Mother'
from public."user" u
where u.account_email = 'jpagbilao@up.edu.ph'
on conflict (student_number) do nothing;

insert into public.student (
  account_number,
  student_number,
  housing_status,
  emergency_contact_name,
  emergency_contact_number,
  emergency_contact_relationship
)
select u.account_number, 2023010007, 'Assigned', 'Ramon Pagcaliwagan', '09181230027', 'Father'
from public."user" u
where u.account_email = 'jpagcaliwagan@up.edu.ph'
on conflict (student_number) do nothing;

insert into public.student (
  account_number,
  student_number,
  housing_status,
  emergency_contact_name,
  emergency_contact_number,
  emergency_contact_relationship
)
select u.account_number, 2023010008, 'Assigned', 'Tina Fernandez', '09181230028', 'Mother'
from public."user" u
where u.account_email = 'lfernandez@up.edu.ph'
on conflict (student_number) do nothing;

insert into public.student (
  account_number,
  student_number,
  housing_status,
  emergency_contact_name,
  emergency_contact_number,
  emergency_contact_relationship
)
select u.account_number, 2023010009, 'Assigned', 'Carmela Cordero', '09181230029', 'Mother'
from public."user" u
where u.account_email = 'nccordero@up.edu.ph'
on conflict (student_number) do nothing;

insert into public.student (
  account_number,
  student_number,
  housing_status,
  emergency_contact_name,
  emergency_contact_number,
  emergency_contact_relationship
)
select u.account_number, 2023010010, 'Assigned', 'Hedley Fababeir', '09181230030', 'Father'
from public."user" u
where u.account_email = 'phfababeir@up.edu.ph'
on conflict (student_number) do nothing;

insert into public.student (
  account_number,
  student_number,
  housing_status,
  emergency_contact_name,
  emergency_contact_number,
  emergency_contact_relationship
)
select u.account_number, 2023010011, 'Assigned', 'Marites Jamolod', '09181230031', 'Mother'
from public."user" u
where u.account_email = 'pmjamolod@up.edu.ph'
on conflict (student_number) do nothing;

insert into public.student (
  account_number,
  student_number,
  housing_status,
  emergency_contact_name,
  emergency_contact_number,
  emergency_contact_relationship
)
select u.account_number, 2023010012, 'Assigned', 'Dre Rebugio', '09181230032', 'Father'
from public."user" u
where u.account_email = 'rdrebugio@up.edu.ph'
on conflict (student_number) do nothing;

insert into public.student (
  account_number,
  student_number,
  housing_status,
  emergency_contact_name,
  emergency_contact_number,
  emergency_contact_relationship
)
select u.account_number, 2023010013, 'Assigned', 'Nestor Aquino', '09181230033', 'Father'
from public."user" u
where u.account_email = 'vgaquino@up.edu.ph'
on conflict (student_number) do nothing;

insert into public.student (
  account_number,
  student_number,
  housing_status,
  emergency_contact_name,
  emergency_contact_number,
  emergency_contact_relationship
)
select u.account_number, 2023010014, 'Not Assigned', 'Nora Silerio', '09181230034', 'Mother'
from public."user" u
where u.account_email = 'zsilerio@up.edu.ph'
on conflict (student_number) do nothing;

insert into public.student_academic (account_number, degree_program, standing, status)
select s.account_number, 'BS Computer Science', 'Junior', 'Active'
from public.student s
where s.student_number = 2023010001
on conflict (account_number) do nothing;

insert into public.student_academic (account_number, degree_program, standing, status)
select s.account_number, 'BS Electrical Engineering', 'Senior', 'Graduating'
from public.student s
where s.student_number = 2023010002
on conflict (account_number) do nothing;

insert into public.student_academic (account_number, degree_program, standing, status)
select s.account_number, 'BS Statistics', 'Sophomore', 'Active'
from public.student s
where s.student_number = 2023010003
on conflict (account_number) do nothing;

insert into public.student_academic (account_number, degree_program, standing, status)
select s.account_number, 'BS Biology', 'Freshman', 'Active'
from public.student s
where s.student_number = 2023010004
on conflict (account_number) do nothing;

insert into public.student_academic (account_number, degree_program, standing, status)
select s.account_number, 'BS Mathematics', 'Sophomore', 'Active'
from public.student s
where s.student_number = 2023010005
on conflict (account_number) do nothing;

insert into public.student_academic (account_number, degree_program, standing, status)
select s.account_number, 'BS Agriculture', 'Junior', 'Active'
from public.student s
where s.student_number = 2023010006
on conflict (account_number) do nothing;

insert into public.student_academic (account_number, degree_program, standing, status)
select s.account_number, 'BS Computer Science', 'Junior', 'Active'
from public.student s
where s.student_number = 2023010007
on conflict (account_number) do nothing;

insert into public.student_academic (account_number, degree_program, standing, status)
select s.account_number, 'BS Development Communication', 'Senior', 'Active'
from public.student s
where s.student_number = 2023010008
on conflict (account_number) do nothing;

insert into public.student_academic (account_number, degree_program, standing, status)
select s.account_number, 'BS Information Technology', 'Sophomore', 'Active'
from public.student s
where s.student_number = 2023010009
on conflict (account_number) do nothing;

insert into public.student_academic (account_number, degree_program, standing, status)
select s.account_number, 'BS Industrial Engineering', 'Senior', 'Active'
from public.student s
where s.student_number = 2023010010
on conflict (account_number) do nothing;

insert into public.student_academic (account_number, degree_program, standing, status)
select s.account_number, 'BS Forestry', 'Freshman', 'Active'
from public.student s
where s.student_number = 2023010011
on conflict (account_number) do nothing;

insert into public.student_academic (account_number, degree_program, standing, status)
select s.account_number, 'BS Economics', 'Sophomore', 'Active'
from public.student s
where s.student_number = 2023010012
on conflict (account_number) do nothing;

insert into public.student_academic (account_number, degree_program, standing, status)
select s.account_number, 'BS Chemical Engineering', 'Senior', 'Active'
from public.student s
where s.student_number = 2023010013
on conflict (account_number) do nothing;

insert into public.student_academic (account_number, degree_program, standing, status)
select s.account_number, 'BS Human Ecology', 'Freshman', 'Delayed'
from public.student s
where s.student_number = 2023010014
on conflict (account_number) do nothing;

-- housing and rooms
insert into public.housing (
  housing_name,
  housing_address,
  housing_type,
  rent_price,
  manager_account_number,
  start_application_date,
  end_application_date,
  is_deleted
)
select 'Makiling Residence Hall', 'Upper Campus, UPLB', 'UP Housing', 3500,
  (select m.account_number from public.manager m join public."user" u on u.account_number = m.account_number where u.account_email = 'ygprudencio@up.edu.ph'),
  '2026-04-01', '2026-05-31', false
where not exists (
  select 1 from public.housing h where h.housing_name = 'Makiling Residence Hall'
);

insert into public.housing (
  housing_name,
  housing_address,
  housing_type,
  rent_price,
  manager_account_number,
  start_application_date,
  end_application_date,
  is_deleted
)
select 'Men''s Residence Hall', 'Lower Campus, UPLB', 'UP Housing', 3000,
  (select m.account_number from public.manager m join public."user" u on u.account_number = m.account_number where u.account_email = 'ygprudencio@up.edu.ph'),
  '2026-04-01', '2026-05-31', false
where not exists (
  select 1 from public.housing h where h.housing_name = 'Men''s Residence Hall'
);

insert into public.housing (
  housing_name,
  housing_address,
  housing_type,
  rent_price,
  manager_account_number,
  start_application_date,
  end_application_date,
  is_deleted
)
select 'Lakeview Apartments', 'Batong Malake, Los Banos', 'Non-UP Housing', 5500,
  (select m.account_number from public.manager m join public."user" u on u.account_number = m.account_number where u.account_email = 'peter.centeno@gmail.com'),
  '2026-04-01', '2026-06-15', false
where not exists (
  select 1 from public.housing h where h.housing_name = 'Lakeview Apartments'
);

insert into public.housing (
  housing_name,
  housing_address,
  housing_type,
  rent_price,
  manager_account_number,
  start_application_date,
  end_application_date,
  is_deleted
)
select 'Crescent Hall', 'Brgy. Batong Malake, Los Banos', 'UP Housing', 3200,
  (select m.account_number from public.manager m join public."user" u on u.account_number = m.account_number where u.account_email = 'jagarcia@up.edu.ph'),
  '2026-04-01', '2026-05-31', false
where not exists (
  select 1 from public.housing h where h.housing_name = 'Crescent Hall'
);

insert into public.housing (
  housing_name,
  housing_address,
  housing_type,
  rent_price,
  manager_account_number,
  start_application_date,
  end_application_date,
  is_deleted
)
select 'Riverview Apartments', 'Brgy. Maahas, Los Banos', 'Non-UP Housing', 4800,
  (select m.account_number from public.manager m join public."user" u on u.account_number = m.account_number where u.account_email = 'peter.centeno@gmail.com'),
  '2026-04-01', '2026-06-30', false
where not exists (
  select 1 from public.housing h where h.housing_name = 'Riverview Apartments'
);

-- rooms for Makiling Residence Hall
insert into public.room (housing_id, room_type, maximum_occupants, occupancy_status, payment_status, is_deleted)
select h.housing_id, 'Single', 1, 'Partially Occupied', 'Paid', false
from public.housing h
where h.housing_name = 'Makiling Residence Hall'
  and not exists (
    select 1 from public.room r where r.housing_id = h.housing_id and r.room_type = 'Single'
  );

insert into public.room (housing_id, room_type, maximum_occupants, occupancy_status, payment_status, is_deleted)
select h.housing_id, 'Double', 2, 'Partially Occupied', 'Pending', false
from public.housing h
where h.housing_name = 'Makiling Residence Hall'
  and not exists (
    select 1 from public.room r where r.housing_id = h.housing_id and r.room_type = 'Double'
  );

-- rooms for Men's Residence Hall
insert into public.room (housing_id, room_type, maximum_occupants, occupancy_status, payment_status, is_deleted)
select h.housing_id, 'Shared', 4, 'Partially Occupied', 'Pending', false
from public.housing h
where h.housing_name = 'Men''s Residence Hall'
  and not exists (
    select 1 from public.room r where r.housing_id = h.housing_id and r.room_type = 'Shared'
  );

insert into public.room (housing_id, room_type, maximum_occupants, occupancy_status, payment_status, is_deleted)
select h.housing_id, 'Single', 1, 'Empty', 'Pending', false
from public.housing h
where h.housing_name = 'Lakeview Apartments'
  and not exists (
    select 1 from public.room r where r.housing_id = h.housing_id and r.room_type = 'Single'
  );

insert into public.room (housing_id, room_type, maximum_occupants, occupancy_status, payment_status, is_deleted)
select h.housing_id, 'Shared', 3, 'Partially Occupied', 'Overdue', false
from public.housing h
where h.housing_name = 'Lakeview Apartments'
  and not exists (
    select 1 from public.room r where r.housing_id = h.housing_id and r.room_type = 'Shared'
  );

update public.room
set occupancy_status = 'Fully Occupied', payment_status = 'Paid'
where housing_id = (select housing_id from public.housing where housing_name = 'Makiling Residence Hall')
  and room_type = 'Single';

update public.room
set occupancy_status = 'Fully Occupied', payment_status = 'Paid'
where housing_id = (select housing_id from public.housing where housing_name = 'Lakeview Apartments')
  and room_type = 'Single';

update public.room
set occupancy_status = 'Fully Occupied', payment_status = 'Paid'
where housing_id = (select housing_id from public.housing where housing_name = 'Riverview Apartments')
  and room_type = 'Single';

-- rooms for Crescent Hall
insert into public.room (housing_id, room_type, maximum_occupants, occupancy_status, payment_status, is_deleted)
select h.housing_id, 'Single', 1, 'Partially Occupied', 'Paid', false
from public.housing h
where h.housing_name = 'Crescent Hall'
  and not exists (
    select 1 from public.room r where r.housing_id = h.housing_id and r.room_type = 'Single'
  );

insert into public.room (housing_id, room_type, maximum_occupants, occupancy_status, payment_status, is_deleted)
select h.housing_id, 'Double', 2, 'Partially Occupied', 'Pending', false
from public.housing h
where h.housing_name = 'Crescent Hall'
  and not exists (
    select 1 from public.room r where r.housing_id = h.housing_id and r.room_type = 'Double'
  );

insert into public.room (housing_id, room_type, maximum_occupants, occupancy_status, payment_status, is_deleted)
select h.housing_id, 'Shared', 4, 'Empty', 'Pending', false
from public.housing h
where h.housing_name = 'Crescent Hall'
  and not exists (
    select 1 from public.room r where r.housing_id = h.housing_id and r.room_type = 'Shared'
  );

-- rooms for Riverview Apartments
insert into public.room (housing_id, room_type, maximum_occupants, occupancy_status, payment_status, is_deleted)
select h.housing_id, 'Single', 1, 'Empty', 'Pending', false
from public.housing h
where h.housing_name = 'Riverview Apartments'
  and not exists (
    select 1 from public.room r where r.housing_id = h.housing_id and r.room_type = 'Single'
  );

insert into public.room (housing_id, room_type, maximum_occupants, occupancy_status, payment_status, is_deleted)
select h.housing_id, 'Double', 2, 'Partially Occupied', 'Pending', false
from public.housing h
where h.housing_name = 'Riverview Apartments'
  and not exists (
    select 1 from public.room r where r.housing_id = h.housing_id and r.room_type = 'Double'
  );

insert into public.room (housing_id, room_type, maximum_occupants, occupancy_status, payment_status, is_deleted)
select h.housing_id, 'Shared', 3, 'Partially Occupied', 'Pending', false
from public.housing h
where h.housing_name = 'Riverview Apartments'
  and not exists (
    select 1 from public.room r where r.housing_id = h.housing_id and r.room_type = 'Shared'
  );

-- apps
insert into public.application (
  housing_name,
  preferred_room_type,
  application_status,
  expected_moveout_date,
  actual_moveout_date,
  room_id,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  'Makiling Residence Hall',
  'Double',
  'Approved',
  '2027-03-31',
  null,
  r.room_id,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Makiling Residence Hall'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Double'
where s.student_number = 2023010001
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Makiling Residence Hall'
  );

insert into public.application (
  housing_name,
  preferred_room_type,
  application_status,
  expected_moveout_date,
  actual_moveout_date,
  room_id,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  'Men''s Residence Hall',
  'Shared',
  'Pending',
  '2027-03-31',
  null,
  r.room_id,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Men''s Residence Hall'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Shared'
where s.student_number = 2023010003
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Men''s Residence Hall'
  );

insert into public.application (
  housing_name,
  preferred_room_type,
  application_status,
  expected_moveout_date,
  actual_moveout_date,
  room_id,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  'Lakeview Apartments',
  'Single',
  'Rejected',
  '2027-03-31',
  null,
  r.room_id,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Lakeview Apartments'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Single'
where s.student_number = 2023010004
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Lakeview Apartments'
  );

insert into public.application (
  housing_name,
  preferred_room_type,
  application_status,
  expected_moveout_date,
  actual_moveout_date,
  room_id,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  'Makiling Residence Hall',
  'Single',
  'Approved',
  '2027-03-31',
  null,
  null,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Makiling Residence Hall'
where s.student_number = 2023010005
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Makiling Residence Hall'
  );

insert into public.application (
  housing_name,
  preferred_room_type,
  application_status,
  expected_moveout_date,
  actual_moveout_date,
  room_id,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  'Makiling Residence Hall',
  'Single',
  'Approved',
  '2027-03-31',
  null,
  r.room_id,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Makiling Residence Hall'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Single'
where s.student_number = 2023010012
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Makiling Residence Hall'
  );

insert into public.application (
  housing_name,
  preferred_room_type,
  application_status,
  expected_moveout_date,
  actual_moveout_date,
  room_id,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  'Men''s Residence Hall',
  'Shared',
  'Approved',
  '2027-03-31',
  null,
  r.room_id,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Men''s Residence Hall'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Shared'
where s.student_number = 2023010006
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Men''s Residence Hall'
  );

insert into public.application (
  housing_name,
  preferred_room_type,
  application_status,
  expected_moveout_date,
  actual_moveout_date,
  room_id,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  'Men''s Residence Hall',
  'Shared',
  'Approved',
  '2027-03-31',
  null,
  r.room_id,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Men''s Residence Hall'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Shared'
where s.student_number = 2023010007
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Men''s Residence Hall'
  );

insert into public.application (
  housing_name,
  preferred_room_type,
  application_status,
  expected_moveout_date,
  actual_moveout_date,
  room_id,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  'Crescent Hall',
  'Double',
  'Approved',
  '2027-03-31',
  null,
  r.room_id,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Crescent Hall'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Double'
where s.student_number = 2023010008
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Crescent Hall'
  );

insert into public.application (
  housing_name,
  preferred_room_type,
  application_status,
  expected_moveout_date,
  actual_moveout_date,
  room_id,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  'Riverview Apartments',
  'Shared',
  'Approved',
  '2027-03-31',
  null,
  r.room_id,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Riverview Apartments'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Shared'
where s.student_number = 2023010009
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Riverview Apartments'
  );

insert into public.application (
  housing_name,
  preferred_room_type,
  application_status,
  expected_moveout_date,
  actual_moveout_date,
  room_id,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  'Riverview Apartments',
  'Single',
  'Approved',
  '2027-03-31',
  null,
  r.room_id,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Riverview Apartments'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Single'
where s.student_number = 2023010013
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Riverview Apartments'
  );

insert into public.application (
  housing_name,
  preferred_room_type,
  application_status,
  expected_moveout_date,
  actual_moveout_date,
  room_id,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  'Lakeview Apartments',
  'Shared',
  'Approved',
  '2027-03-31',
  null,
  r.room_id,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Lakeview Apartments'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Shared'
where s.student_number = 2023010011
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Lakeview Apartments'
  );

insert into public.application (
  housing_name,
  preferred_room_type,
  application_status,
  expected_moveout_date,
  actual_moveout_date,
  room_id,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  'Lakeview Apartments',
  'Double',
  'Approved',
  '2027-03-31',
  null,
  r.room_id,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Lakeview Apartments'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Shared'
where s.student_number = 2023010010
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Lakeview Apartments'
  );

insert into public.application (
  housing_name,
  preferred_room_type,
  application_status,
  expected_moveout_date,
  actual_moveout_date,
  room_id,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  'Lakeview Apartments',
  'Single',
  'Rejected',
  '2027-03-31',
  null,
  null,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Lakeview Apartments'
where s.student_number = 2023010004
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Lakeview Apartments'
  );

insert into public.application (
  housing_name,
  preferred_room_type,
  application_status,
  expected_moveout_date,
  actual_moveout_date,
  room_id,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  'Crescent Hall',
  'Single',
  'Pending',
  '2027-03-31',
  null,
  null,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Crescent Hall'
where s.student_number = 2023010014
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Crescent Hall'
  );

-- documents
insert into public.document (application_Id, type, storage_link)
select a.application_id, 'Form 5', 'mock/form5/angelica-calagui-2026-1.pdf'
from public.application a
join public.student s on s.account_number = a.student_account_number
where s.student_number = 2023010001
  and not exists (
    select 1 from public.document d where d.application_Id = a.application_id and d.type = 'Form 5'
  );

insert into public.document (application_Id, type, storage_link)
select a.application_id, 'Contract', 'mock/contract/angelica-calagui-makiling.pdf'
from public.application a
join public.student s on s.account_number = a.student_account_number
where s.student_number = 2023010001
  and a.application_status = 'Approved'
  and not exists (
    select 1 from public.document d where d.application_Id = a.application_id and d.type = 'Contract'
  );

insert into public.document (application_Id, type, storage_link)
select a.application_id, 'Waiver', 'mock/waiver/giovann-apolinar-shared.pdf'
from public.application a
join public.student s on s.account_number = a.student_account_number
where s.student_number = 2023010003
  and not exists (
    select 1 from public.document d where d.application_Id = a.application_id and d.type = 'Waiver'
  );

insert into public.document (application_Id, type, storage_link)
select a.application_id, 'Form 5', 'mock/form5/jelen-corpuz-crescent.pdf'
from public.application a
join public.student s on s.account_number = a.student_account_number
where s.student_number = 2023010005
  and not exists (
    select 1 from public.document d where d.application_Id = a.application_id and d.type = 'Form 5'
  );

insert into public.document (application_Id, type, storage_link)
select a.application_id, 'Form 5', 'mock/form5/jerome-pagbilao-mens.pdf'
from public.application a
join public.student s on s.account_number = a.student_account_number
where s.student_number = 2023010006
  and not exists (
    select 1 from public.document d where d.application_Id = a.application_id and d.type = 'Form 5'
  );

insert into public.document (application_Id, type, storage_link)
select a.application_id, 'Contract', 'mock/contract/luthelle-fernandez-crescent.pdf'
from public.application a
join public.student s on s.account_number = a.student_account_number
where s.student_number = 2023010008
  and not exists (
    select 1 from public.document d where d.application_Id = a.application_id and d.type = 'Contract'
  );

insert into public.document (application_Id, type, storage_link)
select a.application_id, 'Form 5', 'mock/form5/nicole-cordero-riverview.pdf'
from public.application a
join public.student s on s.account_number = a.student_account_number
where s.student_number = 2023010009
  and not exists (
    select 1 from public.document d where d.application_Id = a.application_id and d.type = 'Form 5'
  );

insert into public.document (application_Id, type, storage_link)
select a.application_id, 'Payment Receipt', 'mock/payment-receipt/phea-jamolod-lakeview.pdf'
from public.application a
join public.student s on s.account_number = a.student_account_number
where s.student_number = 2023010011
  and not exists (
    select 1 from public.document d where d.application_Id = a.application_id and d.type = 'Payment Receipt'
  );

insert into public.document (application_Id, type, storage_link)
select a.application_id, 'Waiver', 'mock/waiver/vince-aquino-riverview.pdf'
from public.application a
join public.student s on s.account_number = a.student_account_number
where s.student_number = 2023010013
  and not exists (
    select 1 from public.document d where d.application_Id = a.application_id and d.type = 'Waiver'
  );

insert into public.document (application_Id, type, storage_link)
select a.application_id, 'Form 5', 'mock/form5/robin-rebugio-makiling.pdf'
from public.application a
join public.student s on s.account_number = a.student_account_number
where s.student_number = 2023010012
  and not exists (
    select 1 from public.document d where d.application_Id = a.application_id and d.type = 'Form 5'
  );

insert into public.document (application_Id, type, storage_link)
select a.application_id, 'Contract', 'mock/contract/robin-rebugio-makiling.pdf'
from public.application a
join public.student s on s.account_number = a.student_account_number
where s.student_number = 2023010012
  and not exists (
    select 1 from public.document d where d.application_Id = a.application_id and d.type = 'Contract'
  );

-- bills
insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  3500,
  'Rent',
  'Paid',
  '2026-04-15T23:59:59+08',
  '2026-04-01T09:00:00+08',
  '2026-04-10T15:20:00+08',
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Makiling Residence Hall'
where s.student_number = 2023010001
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'Rent'
      and b.issue_date::date = '2026-04-01'
  );

insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  420,
  'Utility',
  'Pending',
  '2026-04-18T23:59:59+08',
  '2026-04-05T10:30:00+08',
  null,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Men''s Residence Hall'
where s.student_number = 2023010003
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'Utility'
      and b.issue_date::date = '2026-04-05'
  );

insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  5500,
  'Rent',
  'Overdue',
  '2026-03-15T23:59:59+08',
  '2026-03-01T08:00:00+08',
  null,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Lakeview Apartments'
where s.student_number = 2023010004
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'Rent'
      and b.issue_date::date = '2026-03-01'
  );

insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  3500,
  'Utility',
  'Pending',
  '2026-04-20T23:59:59+08',
  '2026-04-08T08:15:00+08',
  null,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Makiling Residence Hall'
where s.student_number = 2023010001
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'Utility'
      and b.issue_date::date = '2026-04-08'
  );

insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  3000,
  'Rent',
  'Overdue',
  '2026-04-10T23:59:59+08',
  '2026-03-25T08:00:00+08',
  null,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Men''s Residence Hall'
where s.student_number = 2023010006
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'Rent'
      and b.issue_date::date = '2026-03-25'
  );

insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  3000,
  'Rent',
  'Pending',
  '2026-04-10T23:59:59+08',
  '2026-04-03T08:00:00+08',
  null,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Men''s Residence Hall'
where s.student_number = 2023010007
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'Rent'
      and b.issue_date::date = '2026-04-03'
  );

insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  3200,
  'Rent',
  'Paid',
  '2026-04-16T23:59:59+08',
  '2026-04-01T08:20:00+08',
  '2026-04-09T11:45:00+08',
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Crescent Hall'
where s.student_number = 2023010008
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'Rent'
      and b.issue_date::date = '2026-04-01'
  );

insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  4800,
  'Rent',
  'Paid',
  '2026-04-16T23:59:59+08',
  '2026-04-01T08:20:00+08',
  '2026-04-12T14:00:00+08',
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Riverview Apartments'
where s.student_number = 2023010009
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'Rent'
      and b.issue_date::date = '2026-04-01'
  );

insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  4800,
  'Rent',
  'Pending',
  '2026-04-16T23:59:59+08',
  '2026-04-05T08:00:00+08',
  null,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Riverview Apartments'
where s.student_number = 2023010013
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'Rent'
      and b.issue_date::date = '2026-04-05'
  );

insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  5500,
  'Rent',
  'Paid',
  '2026-04-16T23:59:59+08',
  '2026-04-02T08:00:00+08',
  '2026-04-11T15:30:00+08',
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Lakeview Apartments'
where s.student_number = 2023010011
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'Rent'
      and b.issue_date::date = '2026-04-02'
  );

insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  5500,
  'Utility',
  'Overdue',
  '2026-04-18T23:59:59+08',
  '2026-04-01T08:00:00+08',
  null,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Lakeview Apartments'
where s.student_number = 2023010011
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'Utility'
      and b.issue_date::date = '2026-04-01'
  );

insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  3500,
  'Rent',
  'Paid',
  '2026-04-15T23:59:59+08',
  '2026-04-01T08:05:00+08',
  '2026-04-10T09:30:00+08',
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Makiling Residence Hall'
where s.student_number = 2023010012
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'Rent'
      and b.issue_date::date = '2026-04-01'
  );

insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  3200,
  'Utility',
  'Paid',
  '2026-04-20T23:59:59+08',
  '2026-04-06T08:00:00+08',
  '2026-04-13T10:15:00+08',
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Crescent Hall'
where s.student_number = 2023010008
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'Utility'
      and b.issue_date::date = '2026-04-06'
  );

insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  4800,
  'Rent',
  'Pending',
  '2026-04-16T23:59:59+08',
  '2026-04-04T08:00:00+08',
  null,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Riverview Apartments'
where s.student_number = 2023010010
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'Rent'
      and b.issue_date::date = '2026-04-04'
  );

insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  4800,
  'Utility',
  'Paid',
  '2026-04-18T23:59:59+08',
  '2026-04-07T08:00:00+08',
  '2026-04-14T12:00:00+08',
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Riverview Apartments'
where s.student_number = 2023010013
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'Utility'
      and b.issue_date::date = '2026-04-07'
  );

-- accommodation history
insert into public.student_accommodation_history (account_number, room_id, movein_date, moveout_date)
select s.account_number, r.room_id, '2026-02-01', '2027-03-31'
from public.student s
join public.housing h on h.housing_name = 'Makiling Residence Hall'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Double'
where s.student_number = 2023010001
  and not exists (
    select 1 from public.student_accommodation_history sah
    where sah.account_number = s.account_number
      and sah.room_id = r.room_id
      and sah.movein_date = '2026-02-01'
  );

insert into public.student_accommodation_history (account_number, room_id, movein_date, moveout_date)
select s.account_number, r.room_id, '2025-08-10', '2026-01-31'
from public.student s
join public.housing h on h.housing_name = 'Men''s Residence Hall'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Shared'
where s.student_number = 2023010002
  and not exists (
    select 1 from public.student_accommodation_history sah
    where sah.account_number = s.account_number
      and sah.room_id = r.room_id
      and sah.movein_date = '2025-08-10'
  );

insert into public.student_accommodation_history (account_number, room_id, movein_date, moveout_date)
select s.account_number, r.room_id, '2025-01-10', '2025-12-15'
from public.student s
join public.housing h on h.housing_name = 'Lakeview Apartments'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Shared'
where s.student_number = 2023010001
  and not exists (
    select 1 from public.student_accommodation_history sah
    where sah.account_number = s.account_number
      and sah.room_id = r.room_id
      and sah.movein_date = '2025-01-10'
  );

insert into public.student_accommodation_history (account_number, room_id, movein_date, moveout_date)
select s.account_number, r.room_id, '2026-04-01', '2027-03-31'
from public.student s
join public.housing h on h.housing_name = 'Makiling Residence Hall'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Single'
where s.student_number = 2023010012
  and not exists (
    select 1 from public.student_accommodation_history sah
    where sah.account_number = s.account_number
      and sah.room_id = r.room_id
      and sah.movein_date = '2026-04-01'
  );

insert into public.student_accommodation_history (account_number, room_id, movein_date, moveout_date)
select s.account_number, r.room_id, '2026-03-15', '2027-03-31'
from public.student s
join public.housing h on h.housing_name = 'Men''s Residence Hall'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Shared'
where s.student_number = 2023010006
  and not exists (
    select 1 from public.student_accommodation_history sah
    where sah.account_number = s.account_number
      and sah.room_id = r.room_id
      and sah.movein_date = '2026-03-15'
  );

insert into public.student_accommodation_history (account_number, room_id, movein_date, moveout_date)
select s.account_number, r.room_id, '2026-04-01', '2027-03-31'
from public.student s
join public.housing h on h.housing_name = 'Men''s Residence Hall'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Shared'
where s.student_number = 2023010007
  and not exists (
    select 1 from public.student_accommodation_history sah
    where sah.account_number = s.account_number
      and sah.room_id = r.room_id
      and sah.movein_date = '2026-04-01'
  );

insert into public.student_accommodation_history (account_number, room_id, movein_date, moveout_date)
select s.account_number, r.room_id, '2026-04-01', '2027-03-31'
from public.student s
join public.housing h on h.housing_name = 'Crescent Hall'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Double'
where s.student_number = 2023010008
  and not exists (
    select 1 from public.student_accommodation_history sah
    where sah.account_number = s.account_number
      and sah.room_id = r.room_id
      and sah.movein_date = '2026-04-01'
  );

insert into public.student_accommodation_history (account_number, room_id, movein_date, moveout_date)
select s.account_number, r.room_id, '2026-04-01', '2027-03-31'
from public.student s
join public.housing h on h.housing_name = 'Riverview Apartments'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Shared'
where s.student_number = 2023010009
  and not exists (
    select 1 from public.student_accommodation_history sah
    where sah.account_number = s.account_number
      and sah.room_id = r.room_id
      and sah.movein_date = '2026-04-01'
  );

insert into public.student_accommodation_history (account_number, room_id, movein_date, moveout_date)
select s.account_number, r.room_id, '2026-04-02', '2027-03-31'
from public.student s
join public.housing h on h.housing_name = 'Lakeview Apartments'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Single'
where s.student_number = 2023010011
  and not exists (
    select 1 from public.student_accommodation_history sah
    where sah.account_number = s.account_number
      and sah.room_id = r.room_id
      and sah.movein_date = '2026-04-02'
  );

insert into public.student_accommodation_history (account_number, room_id, movein_date, moveout_date)
select s.account_number, r.room_id, '2026-04-03', '2027-03-31'
from public.student s
join public.housing h on h.housing_name = 'Lakeview Apartments'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Shared'
where s.student_number = 2023010010
  and not exists (
    select 1 from public.student_accommodation_history sah
    where sah.account_number = s.account_number
      and sah.room_id = r.room_id
      and sah.movein_date = '2026-04-03'
  );

insert into public.student_accommodation_history (account_number, room_id, movein_date, moveout_date)
select s.account_number, r.room_id, '2026-04-05', '2027-03-31'
from public.student s
join public.housing h on h.housing_name = 'Riverview Apartments'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Single'
where s.student_number = 2023010013
  and not exists (
    select 1 from public.student_accommodation_history sah
    where sah.account_number = s.account_number
      and sah.room_id = r.room_id
      and sah.movein_date = '2026-04-05'
  );

-- edge-case records for robustness testing

-- Deactivated user edge case
update public."user"
set is_deleted = true
where account_email = 'zsilerio@up.edu.ph';

-- Cancelled application edge case with no room assignment
insert into public.application (
  housing_name,
  preferred_room_type,
  application_status,
  expected_moveout_date,
  actual_moveout_date,
  room_id,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  'Riverview Apartments',
  'Double',
  'Cancelled',
  '2027-03-31',
  '2026-04-03',
  null,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Riverview Apartments'
where s.student_number = 2023010014
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Riverview Apartments'
      and a.application_status = 'Cancelled'
  );

-- Soft-deleted historical application edge case
insert into public.application (
  housing_name,
  preferred_room_type,
  application_status,
  expected_moveout_date,
  actual_moveout_date,
  room_id,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  'Makiling Residence Hall',
  'Single',
  'Rejected',
  '2026-12-31',
  '2026-02-15',
  null,
  h.manager_account_number,
  s.account_number,
  true
from public.student s
join public.housing h on h.housing_name = 'Makiling Residence Hall'
where s.student_number = 2023010002
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Makiling Residence Hall'
      and a.is_deleted = true
  );

-- WiFi billing edge cases
insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  650,
  'WiFi',
  'Paid',
  '2026-04-19T23:59:59+08',
  '2026-04-06T08:00:00+08',
  '2026-04-12T18:00:00+08',
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Riverview Apartments'
where s.student_number = 2023010013
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'WiFi'
      and b.issue_date::date = '2026-04-06'
  );

insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  700,
  'WiFi',
  'Overdue',
  '2026-04-14T23:59:59+08',
  '2026-04-01T08:00:00+08',
  null,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Lakeview Apartments'
where s.student_number = 2023010011
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'WiFi'
      and b.issue_date::date = '2026-04-01'
  );

-- Soft-deleted bill edge case
insert into public.bill (
  amount,
  bill_type,
  status,
  due_date,
  issue_date,
  date_paid,
  manager_account_number,
  student_account_number,
  is_deleted
)
select
  999,
  'Utility',
  'Pending',
  '2026-02-01T23:59:59+08',
  '2026-01-20T08:00:00+08',
  null,
  h.manager_account_number,
  s.account_number,
  true
from public.student s
join public.housing h on h.housing_name = 'Makiling Residence Hall'
where s.student_number = 2023010001
  and not exists (
    select 1 from public.bill b
    where b.student_account_number = s.account_number
      and b.bill_type = 'Utility'
      and b.is_deleted = true
      and b.issue_date::date = '2026-01-20'
  );

-- audit logs
insert into public.audit_log (
  timestamp,
  action_type,
  audit_description,
  user_id,
  user_name,
  partial_ip,
  account_number
)
select
  '2026-04-02T10:00:00+08',
  'Application Status',
  'Initial screening approved for Angelica Calagui on application #1001.',
  9001,
  'Yhannis Prudencio',
  '192.168.x.x',
  (select account_number from public."user" where account_email = 'ygprudencio@up.edu.ph')
where not exists (
  select 1 from public.audit_log al
  where al.user_id = 9001
    and al.audit_description = 'Initial screening approved for Angelica Calagui on application #1001.'
);

insert into public.audit_log (
  timestamp,
  action_type,
  audit_description,
  user_id,
  user_name,
  partial_ip,
  account_number
)
select
  '2026-04-11T16:30:00+08',
  'Bill Status',
  'Verified April rent payment for Angelica Calagui. Receipt matched and status changed to Paid.',
  9002,
  'Yhannis Prudencio',
  '192.168.x.x',
  (select account_number from public."user" where account_email = 'ygprudencio@up.edu.ph')
where not exists (
  select 1 from public.audit_log al
  where al.user_id = 9002
    and al.audit_description = 'Verified April rent payment for Angelica Calagui. Receipt matched and status changed to Paid.'
);

insert into public.audit_log (
  timestamp,
  action_type,
  audit_description,
  user_id,
  user_name,
  partial_ip,
  account_number
)
select
  '2026-04-11T17:05:00+08',
  'Application Status',
  'Dashboard view opened for current dorm applications.',
  9003,
  'Yhannis Prudencio',
  '192.168.x.x',
  (select account_number from public."user" where account_email = 'ygprudencio@up.edu.ph')
where not exists (
  select 1 from public.audit_log al
  where al.user_id = 9003
    and al.audit_description = 'Dashboard view opened for current dorm applications.'
);

insert into public.audit_log (
  timestamp,
  action_type,
  audit_description,
  user_id,
  user_name,
  partial_ip,
  account_number
)
select
  '2026-04-11T17:22:00+08',
  'Application Status',
  'Student status checked for Angie Calagui after residence assignment update.',
  9004,
  'Yhannis Prudencio',
  '192.168.x.x',
  (select account_number from public."user" where account_email = 'ygprudencio@up.edu.ph')
where not exists (
  select 1 from public.audit_log al
  where al.user_id = 9004
    and al.audit_description = 'Student status checked for Angie Calagui after residence assignment update.'
);

insert into public.audit_log (
  timestamp,
  action_type,
  audit_description,
  user_id,
  user_name,
  partial_ip,
  account_number
)
select
  '2026-04-12T08:10:00+08',
  'Application Status',
  'Approved housing application for Jelen Corpuz kept pending room assignment at Makiling Residence Hall.',
  9005,
  'James Garcia',
  '192.168.x.x',
  (select account_number from public."user" where account_email = 'jagarcia@up.edu.ph')
where not exists (
  select 1 from public.audit_log al
  where al.user_id = 9005
    and al.audit_description = 'Approved housing application for Jelen Corpuz kept pending room assignment at Makiling Residence Hall.'
);

insert into public.audit_log (
  timestamp,
  action_type,
  audit_description,
  user_id,
  user_name,
  partial_ip,
  account_number
)
select
  '2026-04-12T09:25:00+08',
  'Bill Status',
  'Marked Angelo Dalupan rent as overdue after the due date passed for Men''s Residence Hall.',
  9006,
  'Yhannis Prudencio',
  '192.168.x.x',
  (select account_number from public."user" where account_email = 'ygprudencio@up.edu.ph')
where not exists (
  select 1 from public.audit_log al
  where al.user_id = 9006
    and al.audit_description = 'Marked Angelo Dalupan rent as overdue after the due date passed for Men''s Residence Hall.'
);

insert into public.audit_log (
  timestamp,
  action_type,
  audit_description,
  user_id,
  user_name,
  partial_ip,
  account_number
)
select
  '2026-04-12T11:00:00+08',
  'Application Status',
  'Generated pending application report for Riverview Apartments and Crescent Hall.',
  9007,
  'Peter Centeno',
  '192.168.x.x',
  (select account_number from public."user" where account_email = 'peter.centeno@gmail.com')
where not exists (
  select 1 from public.audit_log al
  where al.user_id = 9007
    and al.audit_description = 'Generated pending application report for Riverview Apartments and Crescent Hall.'
);

insert into public.audit_log (
  timestamp,
  action_type,
  audit_description,
  user_id,
  user_name,
  partial_ip,
  account_number
)
select
  '2026-04-12T14:45:00+08',
  'Bill Status',
  'Exported billing summary for Lakeview Apartments with paid and overdue balances.',
  9008,
  'James Garcia',
  '192.168.x.x',
  (select account_number from public."user" where account_email = 'jagarcia@up.edu.ph')
where not exists (
  select 1 from public.audit_log al
  where al.user_id = 9008
    and al.audit_description = 'Exported billing summary for Lakeview Apartments with paid and overdue balances.'
);

commit;
