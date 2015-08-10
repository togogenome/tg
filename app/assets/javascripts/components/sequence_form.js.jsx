var SequenceForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var fragment = this.refs.fragment.getDOMNode().value.trim();

    $.get(
      '/api/sequence/search.json',
      {'fragment': fragment}
    ).done(
      function(genes) {
        console.log(genes)
        console.log('success')
      }
    )
  },
  render: function() {
    var divStyle = {
      margin: 0,
      padding: 0,
      display: 'inline'
    }

    return (
      <div className='method-container' id='sequence-container'>
        <div className='inner'>
          <form accept-charset="UTF-8" className="form-search" method="get" onSubmit={this.handleSubmit}>
            <div style={divStyle}>
              <input name="utf8" type="hidden" value="✓" />
            </div>
            <input className="input-xlarge" id="fragment" name="fragment" type="search" ref='fragment' />
            <button className="tg-button" name="button" type="submit">Search</button>
          </form>
          <div className='small-note'>
            <p>
              Search genomic sequences by an arbitrary sub-string of any DNA sequence fragments (e.g., "TGGAATTGTGAGCGGATAACAATT" for <i>lac</i> operator reported by <a href="http://www.ncbi.nlm.nih.gov/pubmed/4587255" target="_blank">Gilbert W and Maxam A, 1973</a>)
            </p>
          </div>
        </div>
      </div>
    );
  }
});
