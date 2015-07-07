var React = require('react');

var Block = React.createClass({

    render: function() {
        var ctx = this.props.renderer;
        
        ctx.fillStyle = this.props.color;
        ctx.fillRect(this.props.x, this.props.y, this.props.size, this.props.size);

        return null;
    }

});

module.exports = Block;