var React = require('react/addons'),
    _ = require('lodash');

var Canvas = React.createClass({
    componentDidMount: function() {
        this.setState({
            renderer : this.getRenderingContext()
        });
    },

    getInitialState: function() {
        return {
            renderer : null
        };
    },

    getRenderingContext: function () {
        return this.refs.canvas.getDOMNode().getContext('2d');
    },

    clear: function () {
        if(this.state.renderer) {
            this.state.renderer.clearRect(0, 0, this.props.width, this.props.height);
        }        
    },

    renderChildren: function () {
        var renderer = this.state.renderer;

        if(!renderer) {
            return null;
        }

        var propsToPass = { renderer: renderer, canvasWidth: this.props.width, canvasHeight: this.props.height };

        var renderedChildren = React.Children.map(this.props.children,
            function(child) {
                if(child) {
                    return React.addons.cloneWithProps(child, propsToPass );
                }
                return null;
            });
        
        return renderedChildren;
    },

    render: function() {
        return (
            <canvas ref={"canvas"} {...this.props}>
                {this.renderChildren()}
            </canvas>
        );
    }

});

module.exports = Canvas;