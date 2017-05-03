export default function once(fn) {
  let disposed;

  return function disposable(...args) {
    if (disposed) {
      return;
    }

    disposed = true;
    fn.apply(this, args);
  };
}
