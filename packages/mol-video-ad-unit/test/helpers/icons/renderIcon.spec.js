import loadResource from '../../../src/helpers/resources/loadResource';
import renderIcon from '../../../src/helpers/icons/renderIcon';
import updateIcon from '../../../src/helpers/icons/updateIcon';
import canBeRendered from '../../../src/helpers/icons/canBeRendered';

jest.mock('../../../src/helpers/resources/loadResource');
jest.mock('../../../src/helpers/icons/updateIcon');
jest.mock('../../../src/helpers/icons/canBeRendered');

let config;
let icon;
let iconResource;
let placeholder;

beforeEach(() => {
  placeholder = document.createElement('DIV');
  iconResource = document.createElement('IMG');
  config = {
    placeholder
  };
  icon = {
    height: 5,
    left: 0,
    top: 0,
    width: 5,
    xPosition: 'left',
    yPosition: 'top'
  };
});

afterEach(() => {
  config = null;
  placeholder = null;
  iconResource = null;
  placeholder = null;
});

test('renderIcon must fail if there was a problem creating the icon', () => {
  const loadingError = new Error('problem loading icon');

  loadResource.mockImplementation(() => Promise.reject(loadingError));
  expect(renderIcon(icon, config)).rejects.toBe(loadingError);
});

test('renderIcon must fail if the icon can not be rendered', () => {
  loadResource.mockImplementation(() => Promise.resolve(iconResource));
  updateIcon.mockImplementation(() => icon);
  canBeRendered.mockImplementation(() => false);
  expect(renderIcon(icon, config)).rejects.toThrowErrorMatchingSnapshot();
});

test('must append the icon to the placeholder if three is no problem', async () => {
  loadResource.mockImplementation(() => Promise.resolve(iconResource));
  updateIcon.mockImplementation(() => icon);
  canBeRendered.mockImplementation(() => true);

  await renderIcon(icon, config);

  expect(placeholder.contains(iconResource)).toBe(true);
});

test('renderIcon must reuse previously created icons', async () => {
  loadResource.mockImplementation(() => Promise.resolve(iconResource));
  updateIcon.mockImplementation(() => icon);
  canBeRendered.mockImplementation(() => true);

  const renderedIcon = await renderIcon(icon, config);

  loadResource.mockClear();

  await renderIcon(renderedIcon, config);

  expect(loadResource).not.toHaveBeenCalled();

  expect(placeholder.contains(iconResource)).toBe(true);
});

test('renderIcon must return the updated icon', () => {
  const updatedIcon = Object.assign({}, icon);

  loadResource.mockImplementation(() => Promise.resolve(iconResource));
  updateIcon.mockImplementation(() => updatedIcon);
  canBeRendered.mockImplementation(() => true);

  expect(renderIcon(icon, config)).resolves.toBe(updatedIcon);
});

test('renderIcon must style the icon Element', async () => {
  const updatedIcon = {
    height: 3,
    left: 1,
    top: 4,
    width: 6
  };

  loadResource.mockImplementation(() => Promise.resolve(iconResource));
  updateIcon.mockImplementation(() => updatedIcon);
  canBeRendered.mockImplementation(() => true);

  await renderIcon(icon, config);

  const iconElement = icon.element;

  expect(iconElement.height).toEqual(updatedIcon.height);
  expect(iconElement.width).toEqual(updatedIcon.width);
  expect(iconElement.style.position).toEqual('absolute');
  expect(iconElement.style.left).toEqual(`${updatedIcon.left}px`);
  expect(iconElement.style.top).toEqual(`${updatedIcon.top}px`);
  expect(iconElement.style.height).toEqual(`${updatedIcon.height}px`);
  expect(iconElement.style.width).toEqual(`${updatedIcon.width}px`);
});
