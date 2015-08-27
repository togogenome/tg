var React = require('react');

var mui = require('material-ui'),
  {
    TextField, RaisedButton, Paper,
    Table, TableBody, TableHeader, TableFooter, TableRow, TableHeaderColumn, TableRowColumn, TextField, Toggle
  } = mui;

var styles = {
      paper: {
        padding: '1em'
      }
    }


var SequenceSearchForm = React.createClass({
  handleSubmit(e) {
    e.preventDefault();

    var fragment = this.refs.fragment.getValue().trim();
    if (!fragment) {
      return;
    }
    this.props.onSearchSubmit({fragment: fragment});
  },
  render() {
    return (
      <div>
        <Paper zDepth={3} style={styles.paper}>
          <form method="get" onSubmit={this.handleSubmit}>
            <TextField ref='fragment' fullWidth='true' />
            <RaisedButton type='submit' label="Search" />
          </form>
        </Paper>
        <small>
          Search genomic sequences by an arbitrary sub-string of any DNA sequence fragments (e.g., "TGGAATTGTGAGCGGATAACAATT" for <i>lac</i> operator reported by <a href="http://www.ncbi.nlm.nih.gov/pubmed/4587255" target="_blank">Gilbert W and Maxam A, 1973</a>)
        </small>
      </div>
    );
  }
});

var LocusTagListItem = React.createClass({
  render() {
    var url = "/gene/" + this.props.taxonomy + ":" +this.props.locus_tag;
    return (
      <li><a href={url} target="_blank">{this.props.locus_tag}</a></li>
    );
  }
})

var ProductListItem = React.createClass({
  render() {
    return (
      <li>{this.props.product}</li>
    );
  }
})

var SequenceOntologyListItem = React.createClass({
  render() {
    var {name, uri} = this.props.ontology;
    return (
      <li><a href={uri} target="_blank">{name}</a></li>
    );
  }
})

var SequenceSearchResultRaw = React.createClass({
  _highlightQuery(text, index) {
    return text.slice(0, index) + "<mark>" + text.slice(index, -index) + "</mark>" + text.slice(-index);
  },
  render() {
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
      <TableRow>
        <TableRowColumn>{name}</TableRowColumn>
        <TableRowColumn><ul>{locusTagList}</ul></TableRowColumn>
        <TableRowColumn><ul>{productList}</ul></TableRowColumn>
        <TableRowColumn><ul>{sequenceOntologyList}</ul></TableRowColumn>
        <TableRowColumn>{position}</TableRowColumn>
        <TableRowColumn>{position_end}</TableRowColumn>
        <TableRowColumn><span dangerouslySetInnerHTML={{__html: this._highlightQuery(snippet, metadescription_size)}} /></TableRowColumn>
      </TableRow>
    );
  }
})

var SequenceSearchResultTable = React.createClass({
  render() {
    this.state = {
      stripedRows: true,
      showRowHover: false,
    };


    var sequenceSearchResultRaws = this.props.data.map(function(gene, index) {
      return (
        <SequenceSearchResultRaw gene={gene} key={index} />
      );
    });
    return (
      <Paper zDepth={3} style={styles.paper}>
        <Table>
          <TableHeader displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Sequence name</TableHeaderColumn>
              <TableHeaderColumn>Locus tag</TableHeaderColumn>
              <TableHeaderColumn>Product</TableHeaderColumn>
              <TableHeaderColumn>Sequence ontology</TableHeaderColumn>
              <TableHeaderColumn>Position begin</TableHeaderColumn>
              <TableHeaderColumn>Position end</TableHeaderColumn>
              <TableHeaderColumn>Sequence</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover={true} stripedRows={true}>
            {sequenceSearchResultRaws}
          </TableBody>
        </Table>
      </Paper>
    );
  }
});

var SequencePage = React.createClass({
  handleSearchSubmit(fragment) {
    $.get(
      '/api/sequence/search.json',
      fragment
    ).done(
      function(genes) {
        this.setState({data: genes});
      }.bind(this)
    )
  },
  getInitialState() {
    return {data: []};
  },
  render() {
    var sequenceSearchResult = (this.state.data.length === 0) ? "" : <SequenceSearchResultTable data={this.state.data} />;
    return (
      <div>
        <SequenceSearchForm onSearchSubmit={this.handleSearchSubmit} />
        {sequenceSearchResult}
      </div>
    );
  }
});

module.exports = SequencePage;
