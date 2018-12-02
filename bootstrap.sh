#!/usr/bin/env bash

### Install and configure MongoDB Community Edition
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Bind mongod on all available interfaces
sudo sed -i 's/^  bindIp:/  bindIp: 0.0.0.0/' /etc/mongod.conf

# Restart mongod
sudo systemctl restart mongod

# Enable mongod to start up at boot
sudo systemctl enable mongod


### Install Node.js
wget -qO- https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential


### Install Yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn


### Install PM2
sudo yarn global add pm2
sudo pm2 install pm2-logrotate


### Install Htop
sudo apt-get install -y htop


### Install and configure Apache2
sudo apt-get install -y apache2

# Enable apache2 modules
sudo a2enmod headers
sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http

# Set apache2 Virtual Host
VHOST=$(cat <<EOF
<VirtualHost *:80>
	ProxyRequests off
	ProxyPreserveHost On

	<Proxy *>
		Order deny,allow
		Allow from all
	</Proxy>

	<Location />
		ProxyPass http://localhost:8080/
		ProxyPassReverse http://localhost:8080/
	</Location>

	Servername api.my-analytics.test
</VirtualHost>
EOF
)
echo "${VHOST}" > /etc/apache2/sites-available/api.my-analytics.test.conf

# Enable newly created Virtual Host
sudo a2ensite api.my-analytics.test.conf

# Disable default site
sudo a2dissite 000-default.conf

# Set user and group for apache2
echo "export APACHE_RUN_USER=vagrant" >> /etc/apache2/envvars
echo "export APACHE_RUN_GROUP=vagrant" >> /etc/apache2/envvars

# Restart apache2
sudo systemctl restart apache2

# Enable apache2 to start up at boot
sudo systemctl enable apache2
