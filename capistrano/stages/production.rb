# server-based syntax
server "my-analytics"

# Custom SSH Options
set :ssh_options, {
  forward_agent: true
}