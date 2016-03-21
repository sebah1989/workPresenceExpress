checking work presence app
REST:
	get workers: curl 127.0.0.1:3000/workers
	get all presences: curl 127.0.0.1:3000/presences/all
	get worker presence: curl 127.0.0.1:3000/worker/28/presences
	get go out from work hour: curl 127.0.0.1:3000/worker/28/presences/go_home_hour
	get time left time to go out from work: curl 127.0.0.1:3000/worker/28/presences/work_time_left
	get missing hours at work in this month till today: curl 127.0.0.1:3000/worker/28/presences/month_work_time_left

Starting server:
	if starting first time: npm install
	else npm start