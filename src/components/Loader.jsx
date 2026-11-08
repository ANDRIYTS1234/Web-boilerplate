const Loader = ({ text = 'Loading...' }) => (
  <div className="loader" role="status">
    <span className="loader__spinner" />
    <span className="loader__text">{text}</span>
  </div>
);

export default Loader;
