export const GameIntervals = (function() {
  const interval = (handler, timeout) => {
    let id = -1;
    return {
      start() {
        // This starts the interval if it isn't already started,
        // and throws an error if it is.
        if (this.isStarted) {
          throw new Error("An already started interval cannot be started again.");
        } else {
          id = setInterval(handler, typeof timeout === "function" ? timeout() : timeout);
        }
      },
      get isStarted() {
        return id !== -1;
      },
      stop() {
        // This stops the interval if it isn't already stopped,
        // and does nothing if it is already stopped.
        clearInterval(id);
        id = -1;
      },
      restart() {
        this.stop();
        this.start();
      }
    };
  };
  return {
    // Not a getter because getter will cause stack overflow
    all() {
      return Object.values(GameIntervals)
        .filter(i =>
          Object.prototype.hasOwnProperty.call(i, "start") &&
          Object.prototype.hasOwnProperty.call(i, "stop")
        );
    },
    start() {
      // eslint-disable-next-line no-shadow
      for (const interval of this.all()) {
        interval.start();
      }
    },
    stop() {
      // eslint-disable-next-line no-shadow
      for (const interval of this.all()) {
        interval.stop();
      }
    },
    restart() {
      // eslint-disable-next-line no-shadow
      for (const interval of this.all()) {
        interval.restart();
      }
    },
  };
}());
