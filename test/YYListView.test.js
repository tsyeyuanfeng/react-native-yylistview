import should from 'should';
import { shallow } from 'enzyme';
import React from 'react';
import YYListView from '../dist';

describe('YYListView', () => {

  let yyListView;

  before(() => {
    yyListView = shallow(
      <YYListView />,
    );
  });

  it('should exist', () => {
    YYListView.should.be.ok;
    yyListView.should.be.ok;
  });

  it('should contain a native ListView', () => {
    yyListView.nodes[0].type.displayName.should.equal('ListView');
  });
});
