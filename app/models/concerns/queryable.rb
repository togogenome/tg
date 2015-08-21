require 'erb'

module Queryable
  extend ActiveSupport::Concern

  included do
    class << self
      def query(sparql)
        rdfstore = "http://dev.togogenome.org/sparql-test"
        Rails.logger.info "===== SPARQL (EP: #{rdfstore}) =====\n" + sparql

        conn = Faraday::Connection.new(url: rdfstore) do |faraday|
          faraday.request  :url_encoded
          faraday.response :logger
          faraday.adapter  Faraday.default_adapter
        end

        response = conn.post do |req|
          req.headers['Accept'] = 'application/sparql-results+json'
          req.body = { query: sparql }
        end

        result_json = JSON.parse(response.body)

        bindings = result_json['results']['bindings'].map do |b|
          result_json['head']['vars'].each_with_object({}) do |key, hash|
            # OPTIONAL 指定で結果が無い場合、head vars には SELECT対象の変数が key として含まれるが、results にはその key 自体も含まれない
            hash[key.to_sym] = b[key]['value'] if b.has_key?(key)
          end
        end

        Hashie::Mash.new(rows: bindings)
      end

      extend ERB::DefMethod
      def_erb_method('sequence_sparql(bind_values)', 'app/models/concerns/sparql_templates/sequence_search/sequence.rq.erb')
    end
  end
end
