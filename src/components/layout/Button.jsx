import React from 'react'
import PropTypes from 'prop-types'

function Button({type, isDisabled, children, position, customClickEvent}) {
  return (
    <button type={type} disabled={isDisabled} onClick={customClickEvent} className={`bg-green-500 hover:bg-green-600 text-white duration-100 px-6 py-2 rounded-full h-fit w-fit disabled:opacity-50 ${position}`}>{children}</button>
  )
}

Button.defaultProps = {
    type: "button",
    isDisabled: false,
    position: "",
    customClickEvent: undefined
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
    type: PropTypes.string
}

export default Button