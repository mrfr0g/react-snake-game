var React = require('react'),
    _ = require('lodash'),
    Block = require('./Block');

var Apple = React.createClass({

    render: function() {
        var props = _.assign({}, this.props);
        props.color = "red";

        return (
            <Block {...props} />
        );
    }

});

module.exports = Apple;