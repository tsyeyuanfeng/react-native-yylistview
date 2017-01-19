import should from 'should';
import { shallow } from 'enzyme';
import React from 'react';
import YYListViewCell from '../dist/YYListViewCell';

describe('YYListViewCell', () => {

  let yyListViewCell;

  before(() => {
    yyListViewCell = shallow(
      <YYListViewCell />,
    );
  });

  it('should exist', () => {
    YYListViewCell.should.be.ok;
    yyListViewCell.should.be.ok;
  });

});
