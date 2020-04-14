type LogLevel = 'debug' | 'info' | 'warn' | 'error';
interface LoggerOptions {
  level: LogLevel;
  meta: {
    name: string;
  };
}

const levels = Object.freeze({
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
});

const noop = () => {};

const createLogMethod = (name: string, currentLevel: LogLevel, methodLevel: LogLevel) => {
  if (levels[currentLevel] > levels[methodLevel]) {
    return noop;
  }
  return (message: string, data: any) => {
    console.log({
      ...data,
      name,
      message,
      level: methodLevel,
    });
  };
};

type LogMethod = (message: string, data: any) => void;
interface LoggerInstance {
  info: LogMethod;
}
export class Logger implements LoggerInstance {
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  constructor(readonly options: LoggerOptions) {
    this.debug = createLogMethod(options.meta.name, options.level, 'debug');
    this.info = createLogMethod(options.meta.name, options.level, 'info');
    this.warn = createLogMethod(options.meta.name, options.level, 'warn');
    this.error = createLogMethod(options.meta.name, options.level, 'error');
  }
}
