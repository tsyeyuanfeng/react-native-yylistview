import should from 'should';
import { shallow } from 'enzyme';
import YYListViewCell from '../dist/YYListViewCell';
import React from 'react';

describe('YYListViewCell', () => {

  let yyListViewCell;

  before(() => {
    yyListViewCell = shallow(
      <YYListViewCell />
    );
  });

  it('should exist', () => {
    YYListViewCell.should.be.ok;
    yyListViewCell.should.be.ok;
  });

});
