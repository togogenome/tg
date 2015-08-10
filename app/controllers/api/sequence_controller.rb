class Api::SequenceController < Api::ApplicationController
  def search(fragment)
    render json: {length: fragment.length}
  end
end
