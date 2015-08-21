class Api::SequenceController < Api::ApplicationController
  def search(fragment)
    sequences = SequenceSearch::Sequence.search(fragment)

    render json: sequences
  end
end
