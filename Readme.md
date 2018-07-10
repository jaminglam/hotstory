# Deployment for Hotstory Project

1. Start Application
   1. __SSH remote server__, open your terminal, type 'ssh {username}@{remoteServerIp}', then enter your {password}, eg. `ssh root@192.32.21.45 `

   2. After accessing your remote server, you can find backup source code put in `~/git/hotstory`, and the real source code which run in the server `~/hotstory`

   3. __Kill Application__,  If you want to restart the application. Please KILL it first. Please run this command. `pkill -f node`

   4. __Restart application__, `cd ~/hotstory`, 
      then `(NODE_ENV=dev PORT=5000 npm start &)` , this step can start backend server. Then run `cd ~/hotstory/client`, finally run `(REACT_APP_STAGE=dev npm start &), the final step can start the frontend server.`

2. Start Worker
   1. Crawler is a python worker wrapped by a _worker.sh_ which runs via Crontab. you can type `crontab -e` to check it. If you want to __stop worker__, please modify the crontab content.
   change  `* * * * * . /etc/profile;/bin/bash /root/worker/worker.sh >/dev/null 2>&1` to `# * * * * * . /etc/profile;/bin/bash /root/worker/worker.sh >/dev/null 2>&1` , if you want to __restart worker__, just remove `#` in the beginning of this line.

3. Clear And Recreate Database
   1. _in remote server_, run `mysql -u {db_username} -p {db_password} yzy < ~/git/hotstory/clear_db.sql`

4. Suggestion to recover the project
   1. __SSH remote server__
   2. __Kill Application__
   3. __stop worker__
   4. __Clear And Recreate Database__ (_Optional_, DO __NOT__ use until special case, can skip to next step in normal case)
   5. __restart worker__
   6. plesae take it easy, wait for 2 mins.
   7. __restart application__

