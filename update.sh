#!/bin/bash
# A script that updates foodTracker

# move database
echo "Moving database out"
mv database/ ..

# step up
cd ..

#remove old folder
rm -rf foodTracker

# clone repo -> makes new folder
git clone https://github.com/cr4yfish/work-tracker.git

# move database back into food tracker
echo "Moving database back"
mv database/ work-tracker/

# install latest npm libs
echo "Installing npm libs"
cd work-tracker
npm install

# add permissions
echo "Adding permissions to new update.sh"
chmod 700 update.sh

# restart process
echo "Restarting process"
pm2 restart work-tracker

#refresh directory
echo "Refreshing indexed directories"
cd .

# done
echo "Done"