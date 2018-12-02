namespace :app do
  desc 'Build client'
  task :build do
    on roles(:all) do
      within release_path + 'app' do
        execute :yarn, 'install'
        execute :yarn, 'run', 'build'
        execute :rm, '-rf', '/var/www/my-analytics/www/*'
        execute :mv, 'build/*', '/var/www/my-analytics/www'
        execute :rmdir, 'build'
      end
    end
  end
end