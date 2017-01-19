import React, { Component, PropTypes } from 'react';
import { ListView, ScrollView, View, Platform } from 'react-native';
import YYListViewCell from './YYListViewCell';

const isIOS = Platform.OS === 'ios';

const propTypes = {
    ...ListView.propTypes,
    renderScrollComponent: PropTypes.func,
};

class YYListView extends Component {
    constructor(props) {
        super(props);

        this.sections = {};
        this.rows = {};
        this.separators ={};
        this.cells = [];
        this.cellOffsets = [];

        this.onCellLayout = this.onCellLayout.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.renderScrollComponent = this.renderScrollComponent.bind(this);
        this.renderSectionHeader = this.renderSectionHeader.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderSeparator = this.renderSeparator.bind(this);
    }

    getNativeListView() {
        return this.refs.nativeListView;
    }

    getScrollResponder() {
        return this.refs.nativeListView.getScrollResponder();
    }

    /**
     * Calculate cells' offsets
     */
    calcCellOffsets() {
        let offsets = [], prev = 0, next = 0;
        this.cells.forEach((cell, index) => {
            prev = next;
            next =  this.props.horizontal ? (prev + cell.viewProperties.width) : (prev + cell.viewProperties.height);
            offsets.push(next);
        });
        this.cellOffsets = offsets;
    }

    /**
     * Cell layout event callback
     * Recalculate cells' offsets when cell layout event triggered
     */
    onCellLayout(ref, size) {
        this.calcCellOffsets();
    }

    /**
     * ListView scroll event callback.
     * We update the cells' visibility each time scroll event is triggered
     */
    onScroll(e) {
        // Calculate the current content offsets
        let contentOffsetX = e.nativeEvent.contentOffset.x;
        let contentOffsetY = e.nativeEvent.contentOffset.y;
        let layoutMeasurementWidth = e.nativeEvent.layoutMeasurement.width;
        let layoutMeasurementHeight = e.nativeEvent.layoutMeasurement.height;
        let currentOffset = [
            this.props.horizontal ? contentOffsetX : contentOffsetY,
            this.props.horizontal ? (contentOffsetX + layoutMeasurementWidth): (contentOffsetY + layoutMeasurementHeight)
        ];

        // Calculate the range of visible cells.
        let cellOffsets = this.cellOffsets;
        let visibleStart = 0;

        while(cellOffsets[visibleStart++] < currentOffset[0]);
        visibleStart--;

        let visibleEnd = visibleStart;
        while(cellOffsets[visibleEnd++] <= currentOffset[1]);
        visibleEnd--;

        // Update cells' visibility
        this.cells.forEach((cell, index) => {
            if(index >= visibleStart && index <= visibleEnd) {
                cell && cell.setVisibility(true);
            }
            else {
                cell && cell.setVisibility(false);
            }
        });

        this.props.onScroll && this.props.onScroll(e);
    }

    renderScrollComponent(props) {
        let component;

        if (props.renderScrollComponent) {
            component = props.renderScrollComponent(props);
        } else {
            component = (
                <ScrollView {...props} />
            );
        }

        return component;
    }

    renderSectionHeader(sectionData, sectionID) {
        const view = this.props.renderSectionHeader ?  this.props.renderSectionHeader(sectionData, sectionID) : <View/>;
        return (
            <YYListViewCell
                key={'section-' + sectionID}
                view={view}
                onLayout={this.onCellLayout}
                ref={(ref) => {
                    if(!this.sections[sectionID]) {
                        this.cells.push(ref);
                        this.sections[sectionID] = true;
                    }
                }}
            />
        );
    }

    renderRow(rowData, sectionID, rowID) {
        const view = this.props.renderRow(rowData, sectionID, rowID);
        return (
            <YYListViewCell
                key={'row-' + rowID}
                view={view}
                onLayout={this.onCellLayout}
                ref={(ref) => {
                    if(!this.rows[rowID]) {
                        this.cells.push(ref);
                        this.rows[rowID] = true;
                    }
                }}
            />
        );
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        const view = this.props.renderSeparator ?  this.props.renderSeparator(sectionID, rowID, adjacentRowHighlighted) : <View/>;
        return (
            <YYListViewCell
                key={'sep-' + rowID}
                view={view}
                onLayout={this.onCellLayout}
                ref={(ref) => {
                    if(!this.separators[rowID]) {
                        this.cells.push(ref);
                        this.separators[rowID] = true;
                    }
                }}
            />
        );
    }

    render() {
        if(isIOS) {
            return (
                <ListView
                    ref="nativeListView"
                    scrollEventThrottle={1}
                    {...this.props}
                    renderScrollComponent={this.renderScrollComponent}
                    renderSectionHeader={this.renderSectionHeader}
                    renderRow={this.renderRow}
                    renderSeparator={this.renderSeparator}
                    onScroll={this.onScroll}
                />
            );
        }
        else {
            return (
                <ListView
                    ref="nativeListView"
                    removeClippedSubviews
                    {...this.props}
                    renderScrollComponent={this.renderScrollComponent}
                />
            );
        }
    }
}

YYListView.defaultPropTypes = propTypes;
export default YYListView;
