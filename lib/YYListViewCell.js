import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';


const propTypes = {
    view: PropTypes.element.isRequired,
    onLayout: PropTypes.func.isRequired,
};

class YYListViewCell extends Component {
    constructor(props) {
        super(props);

        this.state = {visibility: true};

        this.viewProperties = {
          width: 0, // the view defaults to width of size 0
          height: 0, // the view defaults to height of size 0
        };
        this.mounted = false;

        this.onLayout = this.onLayout.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
    }

    onLayout(evt) {
        // When the cell has actually been layed out, record the rendered width & height
        this.viewProperties.width = evt.nativeEvent.layout.width;
        this.viewProperties.height = evt.nativeEvent.layout.height;

        this.props.onLayout(this, {with: this.viewProperties.width, height: this.viewProperties.height});
    }

    setVisibility(visibility) {
        if (this.state.visibility == visibility || !this.mounted) {
            return;
        }

        if (visibility == true) {
            this.setState({ visibility: true });
        }
        else {
            this.setState({ visibility: false });
        }
    }

    render() {
        if (this.state.visibility === false) {
            return (
                <View style={{ width: this.viewProperties.width, height: this.viewProperties.height }} />
            );
        }

        return (
            <View onLayout={this.onLayout}>
                {this.props.view}
            </View>
        );
    }
}

YYListViewCell.propTypes = propTypes;

export default YYListViewCell;
