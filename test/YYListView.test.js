import should from 'should';
import { shallow } from 'enzyme';
import YYListView from '../dist';
import React from 'react';

describe('YYListView', () => {

  let yyListView;

  before(() => {
    yyListView = shallow(
      <YYListView />
    );
  });

  it('should exist', () => {
    YYListView.should.be.ok;
    yyListView.should.be.ok;
  });

  it('should contain a native ListView', () => {
    yyListView.nodes[0].type.displayName.should.equal('ListView');
  });

  it('should contain a ref to a native ListView component', () => {
    yyListView.nodes[0].ref.should.equal('nativeListView');
  });

});
