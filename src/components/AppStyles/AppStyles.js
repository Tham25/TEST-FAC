import PropTypes from 'prop-types';
import './AppStyles.module.scss';

function AppStyles({ children }) {
  return children;
}

AppStyles.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppStyles;
