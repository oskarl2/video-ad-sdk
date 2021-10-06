import {linearEvents} from '../../../../tracker';
import {VideoAdContainer} from '../../../../adContainer';
import {MetricHandlerData, Cancel} from '../../../../types';

const {clickThrough} = linearEvents;

const onClickThrough = (
  {videoElement, element}: VideoAdContainer,
  callback: (event: string) => void,
  {clickThroughUrl}: MetricHandlerData = {}
): Cancel => {
  const placeholder = element || videoElement.parentNode;
  const anchor = document.createElement('a');

  anchor.classList.add('mol-vast-clickthrough');
  anchor.style.width = '100%';
  anchor.style.height = '100%';
  anchor.style.position = 'absolute';
  anchor.style.left = '0';
  anchor.style.top = '0';

  if (clickThroughUrl) {
    anchor.href = clickThroughUrl;
    anchor.target = '_blank';
  }

  anchor.onclick = (event) => {
    event.stopPropagation?.();

    if (videoElement.paused) {
      event.preventDefault?.();

      videoElement.play();
    } else {
      videoElement.pause();

      callback(clickThrough);
    }
  };

  placeholder.appendChild(anchor);

  return () => placeholder.removeChild(anchor);
};

export default onClickThrough;
