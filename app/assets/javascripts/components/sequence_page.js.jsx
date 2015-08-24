var SequenceSearchForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var fragment = React.findDOMNode(this.refs.fragment).value.trim();
    if (!fragment) {
      return;
    }
    this.props.onSearchSubmit({fragment: fragment});
  },
  render: function() {
    return (
      <div className='sequenceSearchForm'>
        <form className="form-inline" method="get" onSubmit={this.handleSubmit}>
          <fieldset className="form-group">
            <input className="form-control" id="fragment" name="fragment" type="text" ref='fragment' />
            <button className="btn" type="submit">Search</button>
          </fieldset>
        </form>
        <small className='text-muted'>
          Search genomic sequences by an arbitrary sub-string of any DNA sequence fragments (e.g., "TGGAATTGTGAGCGGATAACAATT" for <i>lac</i> operator reported by <a href="http://www.ncbi.nlm.nih.gov/pubmed/4587255" target="_blank">Gilbert W and Maxam A, 1973</a>)
        </small>
      </div>
    );
  }
});

var LocusTagListItem = React.createClass({
  render: function() {
    var url = "/gene/" + this.props.taxonomy + ":" +this.props.locus_tag;
    return (
      <li><a href={url} target="_blank">{this.props.locus_tag}</a></li>
    );
  }
})

var ProductListItem = React.createClass({
  render: function() {
    return (
      <li>{this.props.product}</li>
    );
  }
})

var SequenceOntologyListItem = React.createClass({
  render: function() {
    var {name, uri} = this.props.ontology;
    return (
      <li><a href={uri} target="_blank">{name}</a></li>
    );
  }
})

var SequenceSearchResultRaw = React.createClass({
  _highlightQuery: function(text, index) {
    return text.slice(0, index) + "<mark>" + text.slice(index, -index) + "</mark>" + text.slice(-index);
  },
  render: function() {
    var {name, taxonomy, position, position_end, snippet, metadescription_size} = this.props.gene;
    var locusTagList = this.props.gene.locus_tags.map(function(locus_tag, index) {
      return (
        <LocusTagListItem taxonomy={taxonomy} locus_tag={locus_tag} key={index} />
      );
    });
    var productList = this.props.gene.products.map(function(product, index) {
      return (
        <ProductListItem product={product} key={index} />
      );
    });
    var sequenceOntologyList = this.props.gene.sequence_ontologies.map(function(ontology, index) {
      return (
        <SequenceOntologyListItem ontology={ontology} key={index} />
      );
    });

    return (
      <tr className="sequenceSearchResultRaw">
        <td>{name}</td>
        <td><ul>{locusTagList}</ul></td>
        <td><ul>{productList}</ul></td>
        <td><ul>{sequenceOntologyList}</ul></td>
        <td>{position}</td>
        <td>{position_end}</td>
        <td><span dangerouslySetInnerHTML={{__html: this._highlightQuery(snippet, metadescription_size)}} /></td>
      </tr>
    );
  }
})

var SequenceSearchResultTable = React.createClass({
  render: function() {
    var sequenceSearchResultRaws = this.props.data.map(function(gene, index) {
      return (
        <SequenceSearchResultRaw gene={gene} key={index} />
      );
    });
    return (
      <div className='sequenceSearchResultTable'>
        <table className='table table-striped table-bordered table-hover'>
          <thead className='thead-inverse'>
            <tr>
              <th>Sequence name</th>
              <th>Locus tag</th>
              <th>Product</th>
              <th>Sequence ontology</th>
              <th>Position begin</th>
              <th>Position end</th>
              <th>Sequence</th>
            </tr>
          </thead>
          <tbody>
            {sequenceSearchResultRaws}
          </tbody>
        </table>
      </div>
    );
  }
});

var SequencePage = React.createClass({
  handleSearchSubmit: function(fragment) {
    $.get(
      '/api/sequence/search.json',
      fragment
    ).done(
      function(genes) {
        this.setState({data: genes});
      }.bind(this)
    )
  },
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    var sequenceSearchResult = (this.state.data.length === 0) ? "" : <SequenceSearchResultTable data={this.state.data} />;
    return (
      <div className='sequencePage'>
        <SequenceSearchForm onSearchSubmit={this.handleSearchSubmit} />
        {sequenceSearchResult}
      </div>
    );
  }
});
