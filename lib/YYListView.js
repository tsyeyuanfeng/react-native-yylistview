import React, { Component, PropTypes } from 'react';
import { ListView, ScrollView, View, Platform } from 'react-native';
import YYListViewCell from './YYListViewCell';

const isIOS = Platform.OS === 'ios';

const propTypes = {
  ...ListView.propTypes,
  renderScrollComponent: PropTypes.func,
  scrollRenderAheadDistance: PropTypes.number,
};

const defaultProps = {
  ...ListView.defaultProps,
  scrollRenderAheadDistance: 0,
};

class YYListView extends Component {
  constructor(props) {
    super(props);

    this.sections = {};
    this.rows = {};
    this.separators = {};
    this.cells = [];
    this.cellOffsets = [];
    this.nativeListView = null;

    this.onCellLayout = this.onCellLayout.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.renderScrollComponent = this.renderScrollComponent.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderSeparator = this.renderSeparator.bind(this);
  }

  /**
   * Cell layout event callback
   * Recalculate cells' offsets when cell layout event triggered
   */
  onCellLayout() {
    this.calcCellOffsets();
  }

  /**
   * ListView scroll event callback.
   * We update the cells' visibility each time scroll event is triggered
   */
  onScroll(e) {
        // Calculate the current content offsets
    const { scrollRenderAheadDistance } = this.props;
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    const contentOffsetX = contentOffset.x - scrollRenderAheadDistance;
    const contentOffsetY = contentOffset.y - scrollRenderAheadDistance;
    const layoutMeasurementWidth = layoutMeasurement.width + scrollRenderAheadDistance;
    const layoutMeasurementHeight = layoutMeasurement.height + scrollRenderAheadDistance;
    const currentOffset = [
      this.props.horizontal ? contentOffsetX : contentOffsetY,
      this.props.horizontal ? (contentOffsetX + layoutMeasurementWidth)
                            : (contentOffsetY + layoutMeasurementHeight),
    ];

        // Calculate the range of visible cells.
    const cellOffsets = this.cellOffsets;
    let visibleStart = 0;

    while (cellOffsets[visibleStart++] < currentOffset[0]);
    visibleStart--;

    let visibleEnd = visibleStart;
    while (cellOffsets[visibleEnd++] <= currentOffset[1]);
    visibleEnd--;

        // Update cells' visibility
    this.cells.forEach((cell, index) => {
      if (index >= visibleStart && index <= visibleEnd) {
        cell && cell.setVisibility(true);
      } else {
        cell && cell.setVisibility(false);
      }
    });

    this.props.onScroll && this.props.onScroll(e);
  }

  getNativeListView() {
    return this.nativeListView;
  }

  getScrollResponder() {
    return this.nativeListView.getScrollResponder();
  }

  /**
   * Calculate cells' offsets
   */
  calcCellOffsets() {
    const offsets = [];
    let prev = 0;
    let next = 0;
    this.cells.forEach((cell) => {
      prev = next;
      next = this.props.horizontal ? (prev + cell.viewProperties.width)
                                   : (prev + cell.viewProperties.height);
      offsets.push(next);
    });
    this.cellOffsets = offsets;
  }

  renderScrollComponent(props) {
    let component;

    if (this.props.renderScrollComponent) {
      component = this.props.renderScrollComponent(props);
    } else {
      component = (
        <ScrollView {...props} />
      );
    }

    return component;
  }

  renderSectionHeader(sectionData, sectionID) {
    const view = this.props.renderSectionHeader ?
                    this.props.renderSectionHeader(sectionData, sectionID) :
                    <View />;
    return (
      <YYListViewCell
        key={`section-${sectionID}`}
        view={view}
        onLayout={this.onCellLayout}
        ref={(ref) => {
          if (!this.sections[sectionID]) {
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
        key={`row-${rowID}`}
        view={view}
        onLayout={this.onCellLayout}
        ref={(ref) => {
          if (!this.rows[rowID]) {
            this.cells.push(ref);
            this.rows[rowID] = true;
          }
        }}
      />
    );
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    const view = this.props.renderSeparator ?
                    this.props.renderSeparator(sectionID, rowID, adjacentRowHighlighted) :
                    <View />;
    return (
      <YYListViewCell
        key={`sep-${rowID}`}
        view={view}
        onLayout={this.onCellLayout}
        ref={(ref) => {
          if (!this.separators[rowID]) {
            this.cells.push(ref);
            this.separators[rowID] = true;
          }
        }}
      />
    );
  }

  render() {
    let listView;
    if (isIOS) {
      listView = (
        <ListView
          ref={(ref) => { this.nativeListView = ref; }}
          scrollEventThrottle={1}
          {...this.props}
          renderScrollComponent={this.renderScrollComponent}
          renderSectionHeader={this.renderSectionHeader}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
          onScroll={this.onScroll}
        />
      );
    } else {
      listView = (
        <ListView
          ref={(ref) => { this.nativeListView = ref; }}
          removeClippedSubviews
          {...this.props}
          renderScrollComponent={this.renderScrollComponent}
        />
      );
    }
    return listView;
  }
}

YYListView.propTypes = propTypes;
YYListView.defaultProps = defaultProps;
export default YYListView;
