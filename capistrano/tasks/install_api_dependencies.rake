namespace :api do
  desc 'Install API dependencies'
  task :install_dependencies do
    on roles(:all) do
      within release_path + 'api' do
        execute :yarn, 'install'
      end
    end
  end
end