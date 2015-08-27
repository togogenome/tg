var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var React = require('react'),
  mui = require('material-ui'),
  ThemeManager = new mui.Styles.ThemeManager(),
  {Tabs, Tab} = mui;

var FacetPage =    require('./components/facet_page.js.jsx'),
    SequencePage = require('./components/sequence_page.js.jsx'),
    ConverterPage = require('./components/converter_page.js.jsx'),
    ResolverPage = require('./components/resolver_page.js.jsx');

var App = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  render() {
    return (
      <MyTabs />
    );
  }
});

var MyTabs = React.createClass({
  render() {
    return (
      <div>
        <Tabs>
          <Tab label="Facet">
            <FacetPage />
          </Tab>
          <Tab label="Sequence">
            <SequencePage />
          </Tab>
          <Tab label="ID Converter">
            <ConverterPage />
          </Tab>
          <Tab label="ID Resolver">
            <ResolverPage />
          </Tab>
        </Tabs>
      </div>
    );
  }
});

React.render(<App />, document.body);
