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
  ('joella.elindo@up.edu.ph', 'Joella', null, 'Elindo', 'demo_hash_sysadmin', 'Female', 'System Admin', 'joella.elindo@up.edu.ph', '09171230001', '1988-05-14', 'UPLB Campus, Los Banos, Laguna', false),
  ('yhannis.prudencio@up.edu.ph', 'Yhannis', 'Geosh', 'Prudencio', 'demo_hash_manager1', 'Male', 'Manager', 'yhannis.prudencio@up.edu.ph', '09171230002', '1984-02-08', 'F.O. Santos, Los Banos, Laguna', false),
  ('peter.centeno@gmail.com', 'Peter', 'Jehmuel', 'Centeno', 'demo_hash_manager2', 'Male', 'Manager', 'peter.centeno@gmail.com', '09171230003', '1981-09-22', 'Batong Malake, Los Banos, Laguna', false),
  ('angelica.calagui@up.edu.ph', 'Angelica', null, 'Calagui', 'demo_hash_student1', 'Female', 'Student', 'angelica.calagui@up.edu.ph', '09171230011', '2005-01-04', 'Calamba, Laguna', false),
  ('angelo.dalupan@up.edu.ph', 'Angelo', 'Rene', 'Dalupan', 'demo_hash_student2', 'Male', 'Student', 'angelo.dalupan@up.edu.ph', '09171230012', '2004-07-16', 'San Pablo, Laguna', false),
  ('giovann.apolinar@up.edu.ph', 'Giovann', 'Josh', 'Apolinar', 'demo_hash_student3', 'Male', 'Student', 'giovann.apolinar@up.edu.ph', '09171230013', '2003-11-02', 'Sta. Cruz, Laguna', false),
  ('sophia.ganot@up.edu.ph', 'Sophia', 'Reign', 'Ganot', 'demo_hash_student4', 'Female', 'Student', 'sophia.ganot@up.edu.ph', '09171230014', '2005-03-30', 'Bay, Laguna', false)
on conflict (account_email) do nothing; -- if all users in the above list dont already exist, insert. else, skip to avoid duplicates.

-- housing admins and landlords are also managers, so we need to insert them into the manager table as well.
-- the email is the identifier of the user
insert into public.manager (account_number, manager_type)
select u.account_number, 'Housing Administrator'
from public."user" u
where u.account_email = 'yhannis.prudencio@up.edu.ph'
on conflict (account_number) do nothing;

insert into public.manager (account_number, manager_type)
select u.account_number, 'Housing Administrator'
from public."user" u
where u.account_email = 'joella.elindo@up.edu.ph'
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
where u.account_email = 'joella.elindo@up.edu.ph'
on conflict (account_number) do nothing;

insert into public.housing_admin (account_number)
select m.account_number
from public.manager m
join public."user" u on u.account_number = m.account_number
where u.account_email = 'yhannis.prudencio@up.edu.ph'
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
where u.account_email = 'angelica.calagui@up.edu.ph'
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
where u.account_email = 'angelo.dalupan@up.edu.ph'
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
where u.account_email = 'giovann.apolinar@up.edu.ph'
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
where u.account_email = 'sophia.ganot@up.edu.ph'
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
  (select m.account_number from public.manager m join public."user" u on u.account_number = m.account_number where u.account_email = 'yhannis.prudencio@up.edu.ph'),
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
  (select m.account_number from public.manager m join public."user" u on u.account_number = m.account_number where u.account_email = 'yhannis.prudencio@up.edu.ph'),
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
  'Sampaguita Hall',
  'Shared',
  'Pending',
  '2027-03-31',
  null,
  r.room_id,
  h.manager_account_number,
  s.account_number,
  false
from public.student s
join public.housing h on h.housing_name = 'Sampaguita Hall'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Shared'
where s.student_number = 2023010003
  and not exists (
    select 1 from public.application a
    where a.student_account_number = s.account_number
      and a.housing_name = 'Sampaguita Hall'
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
join public.housing h on h.housing_name = 'Sampaguita Hall'
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
join public.housing h on h.housing_name = 'Sampaguita Hall'
join public.room r on r.housing_id = h.housing_id and r.room_type = 'Shared'
where s.student_number = 2023010002
  and not exists (
    select 1 from public.student_accommodation_history sah
    where sah.account_number = s.account_number
      and sah.room_id = r.room_id
      and sah.movein_date = '2025-08-10'
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
  (select account_number from public."user" where account_email = 'yhannis.prudencio@up.edu.ph')
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
  (select account_number from public."user" where account_email = 'yhannis.prudencio@up.edu.ph')
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
  (select account_number from public."user" where account_email = 'yhannis.prudencio@up.edu.ph')
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
  (select account_number from public."user" where account_email = 'yhannis.prudencio@up.edu.ph')
where not exists (
  select 1 from public.audit_log al
  where al.user_id = 9004
    and al.audit_description = 'Student status checked for Angie Calagui after residence assignment update.'
);

commit;
