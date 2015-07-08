var React = require('react');

var GameStateDisplay = React.createClass({

    render: function() {
        var ctx = this.props.renderer;
        
        ctx.font = "20px Verdana";
        ctx.textAlign = 'center';
        ctx.fillStyle = "black";
        ctx.fillText(this.props.message, this.props.canvasWidth/2, 40);

        return null;
    }

});

module.exports = GameStateDisplay;