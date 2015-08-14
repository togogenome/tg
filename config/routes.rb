Rails.application.routes.draw do
  root to: 'root#show'

  namespace :api, defaults: {format: :json} do
    get '/sequence/search', as: :sequence_search, to: 'sequence#search'
  end
end
