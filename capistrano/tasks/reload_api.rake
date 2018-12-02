namespace :api do
  desc 'Reload API through PM2'
  task :reload do
    on roles(:all) do
      # Move `prod.config.json` from cloned project to `/home/ju/my_analytics/config`
      within release_path do
        execute :mv, 'prod.config.json', deploy_to + 'config'
      end
      # Set sensitive environment variables in `prod.config.json` (DB URL, JWT secret)
      within deploy_to + 'bin' do
        execute './set_api_env_vars.sh'
      end
      # Reload app and update envinronment variables
      within deploy_to + 'config' do
        execute :pm2, 'reload prod.config.json --update-env'
      end
    end
  end
end