var React = require('react'),
    _ = require('lodash'),
    Block = require('./Block');

var Tail = React.createClass({

    render: function() {
        var props = _.assign({}, this.props);
        props.color = "green";

        return (
            <Block {...props} />
        );
    }

});

module.exports = Tail;