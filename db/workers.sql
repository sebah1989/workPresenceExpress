CREATE TABLE 'workers' (
	'id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	'name' VARCHAR(32) NOT NULL,
	'surname' VARCHAR(32) NOT NULL,
	UNIQUE ('name', 'surname') ON CONFLICT IGNORE
);

CREATE TABLE 'presence' (
	'id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	'become_present' TIME DEFAULT (time(CURRENT_TIME, 'localtime')),
	'become_absent' TIME,
	'workday' DATE DEFAULT CURRENT_DATE,
	'worker_id' INTEGER NOT NULL,
	FOREIGN KEY('worker_id') REFERENCES 'workers'('id')
);

CREATE TABLE 'dayoff' (
	'id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	'workday' DATE NOT NULL,
	'worker_id' INTEGER NOT NULL,
	FOREIGN KEY('worker_id') REFERENCES 'workers'('id')
);


CREATE TRIGGER update_become_present_after_insert AFTER INSERT ON presence
BEGIN
	UPDATE presence SET become_present = time(NEW.become_present, '+1 hours') WHERE id = NEW.id;
END;

CREATE TRIGGER update_become_absent_after_update AFTER UPDATE ON presence
BEGIN
	UPDATE presence SET become_absent = time(NEW.become_absent, '+1 hours') WHERE id = NEW.id;
END;
-- insert into workers(name, surname) values ('jacek', 'gacek');
-- insert into presence(worker_id) values (1);