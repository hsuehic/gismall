import React from 'react';
import { shallow } from 'enzyme';
import AccountInfo from './index';

it('AccountInfo Component', () => {
  const wrapper = shallow(<AccountInfo />);
  expect(wrapper.find('span').text()).toEqual('Xiaowei');
});
