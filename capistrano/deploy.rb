# config valid for current version and patch releases of Capistrano
lock '~> 3.11.0'

# Application name
set :application, 'my_analytics'

# Repository address
set :repo_url, 'git@github.com:julienreo/my-analytics-react-node.git'

# Deploy directory
set :deploy_to, '~/my_analytics/'

# Log directory
set :format_options, log_file: 'storage/logs/capistrano.log'

# Linked directories
append :linked_dirs, 'storage/logs'

before 'deploy:symlink:release', 'app:build'
before 'deploy:symlink:release', 'api:install_dependencies'
after 'deploy:symlink:release', 'api:reload'
