// Controller cache so we don't instantiate a new instance for the same controller
// Using singletons to share state of controllers and created instances between requests
const _controllers = {};

export const resolveControllerAction = (
  controller: { new (): void },
  action: string
): Function => {
  const name = controller.name;
  if (!_controllers[name]) {
    _controllers[name] = new controller();
  }

  const instance = _controllers[name];
  return instance[action].bind(instance);
};
