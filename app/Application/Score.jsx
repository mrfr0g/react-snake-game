var React = require('react');

var Score = React.createClass({

    render: function() {
        var ctx = this.props.renderer;

        ctx.font = "12px Verdana";
        ctx.fillStyle = "black";
        ctx.textAlign = 'center';
        ctx.fillText(this.props.score, this.props.canvasWidth/2, this.props.canvasHeight - 5);

        return null;
    }

});

module.exports = Score;