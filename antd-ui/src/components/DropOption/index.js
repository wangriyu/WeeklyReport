import React     from 'react'
import PropTypes from 'prop-types'
import {
  Dropdown,
  Button,
  Icon,
  Menu
}                from 'antd'

const Index = ({ onMenuClick, menuOptions = [], disabled, buttonStyle, dropDownProps }) => {
  const menu = menuOptions.map(item => <Menu.Item key={item.key}>{item.name}</Menu.Item>)

  return (
    <Dropdown
      disabled={disabled}
      overlay={<Menu onClick={onMenuClick}>{menu}</Menu>}
      {...dropDownProps}>
      <Button style={{ ...buttonStyle }}>
        <Icon style={{ marginRight: 2 }} type="bars" />
        <Icon type="down" />
      </Button>
    </Dropdown>
  )
}

Index.propTypes = {
  onMenuClick: PropTypes.func,
  disabled: PropTypes.bool,
  menuOptions: PropTypes.array.isRequired,
  buttonStyle: PropTypes.object,
  dropDownProps: PropTypes.object,
}

export default Index
