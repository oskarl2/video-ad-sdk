/* eslint-disable promise/prefer-await-to-callbacks */
import metricHandlers from './handlers';

const initMetricHandlers = (videoAdContainer, callback, data) => {
  const stopHandlersFns = metricHandlers.map((handler) => handler(videoAdContainer, callback, data));

  return () => stopHandlersFns.forEach((disconnect) => disconnect());
};

export default initMetricHandlers;
