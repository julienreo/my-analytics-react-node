# default deploy_config_path is 'config/deploy.rb'
set :deploy_config_path, File.expand_path('capistrano/deploy.rb')

# default stage_config_path is 'config/deploy'
set :stage_config_path, "capistrano/stages"

# Load DSL and set up stages
require "capistrano/setup"

# Include default deployment tasks
require "capistrano/deploy"

# Load the SCM plugin appropriate to your project:
require "capistrano/scm/git"
install_plugin Capistrano::SCM::Git

# default tasks path is `lib/capistrano/tasks/*.rake`
Dir.glob('capistrano/tasks/*.rake').each { |r| import r }
