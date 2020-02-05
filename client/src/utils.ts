export const isValidUUID = (val: any): boolean =>
  typeof val === 'string' &&
  !!/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/.exec(
    val
  );
