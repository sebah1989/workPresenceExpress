checking work presence app
REST:
	get all presences: curl 127.0.0.1:3000/presences/all
	get worker presence: curl 127.0.0.1:3000/worker/485/presences
	get workers: curl 127.0.0.1:3000/workers

Starting server:
	if starting first time: npm install
	else npm start