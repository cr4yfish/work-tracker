<div id="top"></div>

<br />
<div align="center">

  <h3 align="center">Work Tracker</h3>

  <p align="center">
    Tracks your work time and stores it in a database. Perfect to use with a raspberry to selfhost a local server.
    <br />
    <br />
    <a href="https://github.com/cr4yfish/work-tracker/issues">Report Bug</a>
    ·
    <a href="https://github.com/cr4yfish/work-tracker/issues">Request Feature</a>
  </p>
</div>


<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#settings">Settings</a></li>
        <li><a href="#usage">Usage</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>


## About The Project


So I got a job which does not track my worktime automatically, but I need to keep track of it in order to not work for free.
I came up with the idea of basically taking my foodTracker and using it's base to build another application which
can track time I spent working and store it in a database. It then can automatically choose the entries from the current workweek and
add the time values up to a week overview which then tells me how much I have worked so far and how much worktime I have left.

All in a single-page webapp dashboard, so you never have to switch pages.

It also comes with my (still in development) update client script.


### Built With

* [Express.js](https://expressjs.com/)
* [node.js](https://nodejs.org/en/)
* [node-cron](https://www.npmjs.com/package/node-cron)
* [nedb](https://www.npmjs.com/package/@seald-io/nedb)
* [ejs](https://ejs.co/)



### Prerequisites

* node
    ```
    sudo apt-get node
    ```

* npm
  ```sh
  npm install npm@latest -g
  ```

For the update client to work
* pm2
 ```
 npm install pm2
 ```

### Installation

1. Install NodeJS
2. Clone the repo
    ```sh
    git clone https://github.com/cr4yfish/work-tracker.git
    ```
3. Perform first-time setup
    ```sh
    cd work-tracker
    ```
    ```sh
    chmod 700 initialInstall.sh
    ```
    ```sh
    ./initialInstall.sh
    ```
Wait for the script to finish (The script just makes the 'update.sh' file an executable and adds the server to pm2).

4. Run the server via pm2
    ```sh
    pm2 start work-tracker
    
    ```
    
### Update process
1. Open the webapp in a browser, open the sidebar via the menu icon in the top right and click "update webapp"
2. This may take a couple seconds and will probably crash the webapp (no data loss)
3. When done, you should see a higher version number at the bottom of the sidebar

If this fails, I recommend making a backup of your "database" folder and performing the installation again
then just replace the "database" folder from your backup with the new one in the cloned repo.


## Settings
### To change the hard-coded work time to your own
1. Enter the root folder
    ```sh
    cd work-tracker
    ```
2. Open main.js with the editor of your choice (using NANO here)
    ```sh
    nano public/scripts/main.js
    ```
3. At the very top there's a section called "GLOBAL VARS". Change "weekyWorkTime = 20" to your work time
    ```js
    const weeklyWorkTime = {{your Work Time here}}
    ```
4. Save the file and exit nano. To see the changes, just refresh the browser. You do not need to restart the server.



## Usage

1. Open   
    ```sh
    http://{your IP address or the one from the server}:30002
    ```

2. Press the "play" button at the bottom to start the counter
3. Press the "pause" button to stop the counter

<p align="right">(<a href="#top">back to top</a>)</p>