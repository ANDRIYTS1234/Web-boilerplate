const formatDay = (date) => new Date(date).toLocaleDateString('en-GB', { weekday: 'long' });
const formatDate = (date) => new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

const WeatherCard = ({
  date, icon, text, maxTemp, minTemp, wind, precipitation,
}) => (
  <article className="weather-card">
    <h2 className="weather-card__day">{formatDay(date)}</h2>
    <p className="weather-card__date">{formatDate(date)}</p>
    <div className="weather-card__icon" aria-hidden="true">{icon}</div>
    <p className="weather-card__text">{text}</p>
    <p className="weather-card__temp">
      <span className="weather-card__max">{maxTemp}°</span>
      <span className="weather-card__min">{minTemp}°</span>
    </p>
    <dl className="weather-card__details">
      <div>
        <dt>Wind</dt>
        <dd>{wind} km/h</dd>
      </div>
      <div>
        <dt>Rain</dt>
        <dd>{precipitation ?? 0}%</dd>
      </div>
    </dl>
  </article>
);

export default WeatherCard;
