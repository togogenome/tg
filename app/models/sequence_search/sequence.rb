module SequenceSearch
  class Sequence
    include Queryable

    def self.search(fragment)
      metadescription_size = 10
      genomes = Bio::GGGenome.search('prok', 0, fragment)['results']

      binds = genomes.map {|genome|
        "( #{genome['name'].inspect} #{genome['position']} #{genome['position_end']} #{genome['refseq'].inspect} #{genome['strand'].inspect} )"
      }.join("\n")

      sparql  = sequence_sparql(binds)
      results = query(sparql)

      genomes.map do |genome|
        so = results.rows.select {|r| r.name == genome['name'] }

        start_index = genome['position'] - genome['snippet_pos'] - metadescription_size
        end_index   = genome['position_end'] - genome['snippet_pos'] + metadescription_size

        genome.to_h.merge(
          metadescription_size: metadescription_size,
          snippet: genome['snippet'][start_index..end_index],
          sequence_ontologies: so.map {|r| {uri: r.sequence_ontology, name: r.sequence_ontology_name} },
          locus_tags: so.map {|r| r.locus_tag }.compact.uniq,
          products: so.map {|r| r.product }.compact.uniq
        )
      end
    end
  end
end
