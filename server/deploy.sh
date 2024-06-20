rsync ./index.js ./package.json user1@194.146.25.179:/home/user1/prebid_wrapper -r
ssh user1@194.146.25.179 'cd /home/user1/prebid_wrapper && npm install && pm2 restart prebid_wrapper'
