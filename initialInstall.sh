#!/bin/bash
# A script that install foodTracker

echo "Welcome to WorkTracker. Performing first-time install..."

echo "Caution: Pm2 is needed for this to work!"

# update update.sh chmod
chmod 700 update.sh

echo "Added foodTracker to pm2"
pm2 start index.js --name work-tracker

echo "Done"